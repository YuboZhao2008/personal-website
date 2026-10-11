import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { chromium } from "playwright-core";

// Complement the functional regression suite with repeatable creative review captures.
const require = createRequire(import.meta.url);
const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";
const output = "test-results/redesign";
fs.mkdirSync(output, { recursive: true });
const report = { captures: [], errors: [] };
const browser = await chromium.launch({
  executablePath:
    process.env.BROWSER_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
try {
  for (const [width, height, colorScheme] of [
    [390, 844, "light"],
    [768, 1024, "light"],
    [1440, 1000, "light"],
    [1440, 1000, "dark"],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      reducedMotion: "reduce",
      colorScheme,
    });
    page.on("pageerror", (error) => report.errors.push(error.message));
    await page.addInitScript(() => {
      window.__designMetrics = { cls: 0, lcp: 0 };
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries())
          if (!entry.hadRecentInput) window.__designMetrics.cls += entry.value;
      }).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries())
          window.__designMetrics.lcp = entry.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
    });
    await page.goto(baseURL, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const prefix = `${width}-${colorScheme}`;
    await page.screenshot({ path: `${output}/${prefix}-hero.png` });
    for (const section of [
      "about",
      "projects",
      "experience",
      "achievements",
      "skills",
      "contact",
    ]) {
      await page.locator(`#${section}`).screenshot({
        path: `${output}/${prefix}-${section}.png`,
        style:
          ".site-header, .skip-link, nextjs-portal { visibility: hidden !important; }",
      });
    }
    await page.screenshot({
      path: `${output}/${prefix}-full.png`,
      fullPage: true,
    });
    const measurements = await page.evaluate(() => ({
      ...window.__designMetrics,
      viewport: document.documentElement.clientWidth,
      documentWidth: document.documentElement.scrollWidth,
      documentHeight: document.documentElement.scrollHeight,
      fonts: document.fonts.status,
      resources: performance
        .getEntriesByType("resource")
        .reduce((sum, resource) => sum + resource.transferSize, 0),
      scriptResources: performance
        .getEntriesByType("resource")
        .filter((resource) => resource.initiatorType === "script").length,
      navigation: performance.getEntriesByType("navigation")[0]?.toJSON(),
    }));
    assert(
      measurements.documentWidth <= measurements.viewport,
      `Overflow at ${prefix}`,
    );
    assert(
      measurements.cls < 0.1,
      `Layout shift at ${prefix}: ${measurements.cls}`,
    );
    await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
    const violations = await page.evaluate(async () => {
      const result = await window.axe.run(document.body, {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
        },
      });
      return result.violations.map(({ id, impact, nodes }) => ({
        id,
        impact,
        targets: nodes.map(({ target }) => target),
      }));
    });
    report.captures.push({
      width,
      height,
      colorScheme,
      ...measurements,
      violations,
    });
    assert.deepEqual(violations, [], `Accessibility at ${prefix}`);
    console.log(
      `PASS visual capture ${prefix}; CLS ${measurements.cls.toFixed(4)}; local LCP ${Math.round(measurements.lcp)}ms`,
    );
    await page.close();
  }
  const moving = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "no-preference",
  });
  moving.on("pageerror", (error) => report.errors.push(error.message));
  await moving.goto(baseURL, { waitUntil: "networkidle" });
  await moving.waitForFunction(
    () => document.querySelector(".hero-scene")?.dataset.sceneReady === "true",
  );
  await moving.waitForFunction(
    () =>
      Number(
        getComputedStyle(document.querySelector(".hero-scene-fallback"))
          .opacity,
      ) < 0.01,
  );
  await moving.screenshot({ path: `${output}/1440-motion-hero.png` });
  const firstFrame = await moving.locator(".hero-scene").screenshot();
  await moving.evaluate(
    () =>
      new Promise((resolve) => {
        let frames = 0;
        const frame = () => {
          if (++frames >= 30) resolve();
          else requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      }),
  );
  const laterFrame = await moving
    .locator(".hero-scene")
    .screenshot({ path: `${output}/1440-motion-sculpture.png` });
  assert(
    !firstFrame.equals(laterFrame),
    "The rendered sculpture should visibly evolve while motion is enabled",
  );
  await moving.getByRole("button", { name: "Pause ambient motion" }).click();
  await moving.locator("#project-jarvis > summary").click();
  const surface = moving.locator("#project-jarvis .project-visual");
  await surface.scrollIntoViewIfNeeded();
  const pausedTransform = await surface.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  await surface.hover({ position: { x: 40, y: 40 } });
  await moving.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  assert.equal(
    await surface.evaluate((element) => getComputedStyle(element).transform),
    pausedTransform,
    "Global pause disables pointer tilt",
  );
  report.motion = { renderedFramesDiffer: true, pausedPointerStatic: true };
  await moving.close();
  assert.deepEqual(report.errors, []);
} catch (error) {
  report.failure = error.message;
  throw error;
} finally {
  fs.writeFileSync(`${output}/report.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
