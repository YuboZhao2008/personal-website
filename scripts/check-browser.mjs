import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { chromium } from "playwright-core";

const require = createRequire(import.meta.url);
const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";
const widths = [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920];
const report = {
  viewports: [],
  consoleErrors: [],
  requestFailures: [],
  checks: [],
};
const screenshotStyle =
  ".site-header, .skip-link, nextjs-portal { visibility: hidden !important; }";
fs.mkdirSync("test-results", { recursive: true });

function observeErrors(page) {
  page.on("pageerror", (error) => report.consoleErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") report.consoleErrors.push(message.text());
  });
  page.on("requestfailed", (request) =>
    report.requestFailures.push({
      url: request.url(),
      error: request.failure()?.errorText,
    }),
  );
}
async function noOverflow(page, context) {
  const result = await page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    return {
      width,
      scrollWidth: document.documentElement.scrollWidth,
      overflowing: [...document.querySelectorAll("main *")]
        .filter((el) => {
          if (el instanceof SVGElement) return false;
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.right > width + 1 || r.left < -1);
        })
        .map((el) => el.className)
        .slice(0, 10),
    };
  });
  assert(
    result.scrollWidth <= result.width,
    context + " horizontal overflow: " + JSON.stringify(result),
  );
  assert.equal(
    result.overflowing.length,
    0,
    context + " clipped content: " + JSON.stringify(result),
  );
}
async function stableFrames(page) {
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
}
async function accessibility(page) {
  await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
  return page.evaluate(async () => {
    const result = await window.axe.run(document.querySelector("body"), {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
      },
    });
    return result.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        reason: n.failureSummary,
      })),
    }));
  });
}

const browser = await chromium.launch({
  executablePath:
    process.env.BROWSER_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
try {
  for (const width of widths) {
    const page = await browser.newPage({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    observeErrors(page);
    await page.addInitScript(() => {
      window.__layoutShifts = [];
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries())
          if (!entry.hadRecentInput) window.__layoutShifts.push(entry.value);
      }).observe({ type: "layout-shift", buffered: true });
    });
    const response = await page.goto(baseURL, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator("main > section").count(), 7);
    assert.equal(await page.locator(".project-showcase").count(), 4);
    await noOverflow(page, width + "px initial");

    // Real keyboard activation, including skip-link focus transfer.
    await page.keyboard.press("Tab");
    assert.equal(await page.locator(":focus").textContent(), "Skip to content");
    await page.keyboard.press("Enter");
    assert(
      await page
        .locator("#main")
        .evaluate((el) => el === document.activeElement),
    );

    if (width <= 600) {
      const toggle = page.getByRole("button", { name: "Open navigation" });
      await toggle.click();
      await page.keyboard.press("Escape");
      assert.equal(await toggle.getAttribute("aria-expanded"), "false");
      assert(await toggle.evaluate((el) => el === document.activeElement));
      await toggle.click();
      await page
        .getByRole("navigation")
        .getByRole("link", { name: "Projects", exact: true })
        .click();
      assert.equal(await toggle.getAttribute("aria-expanded"), "false");
      assert(
        await page
          .locator("#projects")
          .evaluate((el) => el === document.activeElement),
      );
    }
    // Every visualization control works without a mouse.
    for (const name of ["Vision / ML", "Robotics", "Worlds", "Agents"]) {
      const selector = page
        .getByRole("group", { name: "Explore engineering focus" })
        .getByRole("button", { name, exact: false });
      await selector.focus();
      await page.keyboard.press("Enter");
      assert.equal(await selector.getAttribute("aria-pressed"), "true");
      await noOverflow(page, width + "px " + name);
    }
    for (const name of ["Open hand", "Closed hand", "Pointing"]) {
      const selector = page
        .getByRole("group", { name: "Explore gesture landmarks" })
        .getByRole("button", { name, exact: true });
      await selector.focus();
      await page.keyboard.press("Space");
      assert.equal(await selector.getAttribute("aria-pressed"), "true");
      assert(
        (await page.locator(".gesture-state").textContent()).includes(
          name.toUpperCase(),
        ),
      );
    }
    const gridBounds = await page.locator(".world-grid").boundingBox();
    const controlsBounds = await page
      .locator(".simulation-controls")
      .boundingBox();
    assert(
      gridBounds.y + gridBounds.height <= controlsBounds.y,
      "World grid overlaps its controls",
    );
    await page.getByRole("button", { name: "Step state" }).click();
    assert(
      (
        await page.locator(".simulation-visual .visual-topline").textContent()
      ).includes("t = 1"),
    );
    await page.getByRole("button", { name: "Reset world state" }).click();
    assert(
      (
        await page.locator(".simulation-visual .visual-topline").textContent()
      ).includes("t = 0"),
    );

    const disclosures = page.locator(".project-details, .skill-details");
    for (let i = 0; i < (await disclosures.count()); i++) {
      await disclosures.nth(i).locator("summary").focus();
      await page.keyboard.press("Enter");
      assert(
        await disclosures.nth(i).evaluate((el) => el.open),
        "Disclosure failed with Enter",
      );
    }
    await noOverflow(page, width + "px expanded");
    if ([320, 768, 1440].includes(width)) {
      const violations = await accessibility(page);
      assert.deepEqual(
        violations,
        [],
        "Accessibility failures at " +
          width +
          ": " +
          JSON.stringify(violations),
      );
    }
    for (let i = 0; i < (await disclosures.count()); i++)
      await disclosures.nth(i).locator("summary").click();
    await page.evaluate(() => scrollTo(0, 0));
    await stableFrames(page);
    await page.waitForFunction(
      () => !document.querySelector(".navigation a[aria-current]"),
    );
    assert.equal(
      await page.evaluate(
        () =>
          document.getAnimations().filter((a) => a.playState === "running")
            .length,
      ),
      0,
      "Reduced motion is still running",
    );
    const cls = await page.evaluate(() =>
      window.__layoutShifts.reduce((sum, value) => sum + value, 0),
    );
    assert(cls < 0.1, "Unexpected layout shift " + cls + " at " + width);

    await page.screenshot({
      path: "test-results/viewport-" + width + ".png",
      fullPage: true,
    });
    await page.screenshot({ path: "test-results/hero-" + width + ".png" });
    if ([390, 1440].includes(width)) {
      for (const section of [
        "projects",
        "experience",
        "achievements",
        "skills",
      ]) {
        await page.locator("#" + section).screenshot({
          path: "test-results/" + section + "-" + width + ".png",
          style: screenshotStyle,
        });
      }
    }
    report.viewports.push({
      width,
      overflow: false,
      cls,
      keyboard: "pass",
      reducedMotion: "pass",
      accessibility: [320, 768, 1440].includes(width)
        ? "axe pass"
        : "covered by adjacent breakpoints",
    });
    console.log(
      "PASS " +
        width +
        "px: layout, controls, disclosures, keyboard, reduced motion; CLS " +
        cls.toFixed(4),
    );
    await page.close();
  }

  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "no-preference",
  });
  observeErrors(page);
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.waitForFunction(() =>
    document.getAnimations().some((a) => a.playState === "running"),
  );
  await page.getByRole("button", { name: "Pause ambient motion" }).click();
  await stableFrames(page);
  assert.equal(
    await page.evaluate(
      () =>
        document.getAnimations().filter((a) => a.playState === "running")
          .length,
    ),
    0,
  );
  await page.getByRole("button", { name: "Resume ambient motion" }).click();
  await page.waitForFunction(() =>
    document.getAnimations().some((a) => a.playState === "running"),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Reduced motion enabled" }).waitFor();
  assert.equal(
    await page.evaluate(
      () =>
        document.getAnimations().filter((a) => a.playState === "running")
          .length,
    ),
    0,
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const target = page
    .getByRole("group", { name: "Explore engineering focus" })
    .getByRole("button", { name: "Worlds" });
  const beforeHover = await target.evaluate(
    (el) => getComputedStyle(el).backgroundColor,
  );
  await target.hover();
  await page.waitForFunction(
    ({ before }) =>
      getComputedStyle(
        [...document.querySelectorAll(".system-selectors button")].at(-1),
      ).backgroundColor !== before,
    { before: beforeHover },
  );
  await target.click();
  assert(
    (await page.locator(".system-readout").textContent()).includes(
      "What happens next?",
    ),
  );
  await page.locator("#projects").scrollIntoViewIfNeeded();
  await page.waitForFunction(
    () => document.querySelector(".hero-art").dataset.visible === "false",
  );
  assert.equal(
    await page
      .locator(".field-trace")
      .evaluate((el) => getComputedStyle(el).animationPlayState),
    "paused",
  );

  // All internal destinations, optional links, and metadata.
  const links = await page.locator("a").evaluateAll((nodes) =>
    nodes.map((a) => ({
      href: a.getAttribute("href"),
      target: a.target,
      rel: a.rel,
    })),
  );
  for (const link of links) {
    assert(
      link.href && !["#", "null", "undefined"].includes(link.href),
      "Placeholder link",
    );
    if (link.href.startsWith("#"))
      assert.equal(
        await page.locator('[id="' + link.href.slice(1) + '"]').count(),
        1,
        "Broken anchor " + link.href,
      );
    if (link.target === "_blank")
      assert(link.rel.includes("noopener") && link.rel.includes("noreferrer"));
  }
  assert(links.some((l) => l.href === "mailto:bowenzhao2020@gmail.com"));
  assert(links.some((l) => l.href === "https://linkedin.com/in/yubozhao-ai"));
  assert.equal(
    await page
      .locator('a[href*="github.com"], a[href*="resume.pdf"], a[href^="tel:"]')
      .count(),
    0,
  );
  assert.equal(
    await page
      .locator('a[aria-disabled="true"], [role="link"][aria-disabled="true"]')
      .count(),
    0,
  );
  assert.equal(
    await page.title(),
    "Yubo Zhao — Software Engineering, AI & Intelligent Systems",
  );
  assert.equal(await page.locator('meta[property="og:title"]').count(), 1);
  assert.equal(await page.locator('meta[name="twitter:card"]').count(), 1);
  assert(
    (await page.locator(".project-evaluation").textContent()).includes(
      "project's test split",
    ),
  );
  const localPaths = [
    "/icon.svg",
    "/robots.txt",
    "/sitemap.xml",
    "/share-image",
  ];
  for (const path of localPaths) {
    const res = await page.request.get(baseURL + path);
    assert.equal(res.status(), 200, path);
    if (path === "/share-image") {
      const body = await res.body();
      assert.equal(body.readUInt32BE(16), 1200);
      assert.equal(body.readUInt32BE(20), 630);
      fs.writeFileSync("test-results/share-image.png", body);
    }
    if (path === "/sitemap.xml")
      assert(!(await res.text()).includes("localhost"));
  }
  report.checks.push(
    "normal motion, pause/resume, preference changes, offscreen pause, hover, all local links, metadata, PNG sharing image, absent optional URLs",
  );

  const touch = await browser.newPage({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  observeErrors(touch);
  await touch.goto(baseURL, { waitUntil: "networkidle" });
  await touch.getByRole("button", { name: "Open navigation" }).tap();
  await touch
    .getByRole("navigation")
    .getByRole("link", { name: "Projects", exact: true })
    .tap();
  assert(touch.url().endsWith("#projects"));
  await touch.getByRole("button", { name: "Open hand", exact: true }).tap();
  assert.equal(
    await touch
      .getByRole("button", { name: "Open hand", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  await touch.getByRole("button", { name: "Step state" }).tap();
  assert(
    (
      await touch.locator(".simulation-visual .visual-topline").textContent()
    ).includes("t = 1"),
  );
  await touch.getByRole("button", { name: "Open navigation" }).tap();
  await touch.setViewportSize({ width: 1024, height: 900 });
  await touch.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await touch
      .getByRole("button", { name: "Open navigation" })
      .getAttribute("aria-expanded"),
    "false",
  );
  report.checks.push(
    "touch navigation, gesture selection, state stepping, resize closes mobile menu",
  );

  const noJS = await browser.newPage({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  await noJS.goto(baseURL);
  assert.equal(await noJS.locator(".project-showcase").count(), 4);
  await noJS.locator(".project-details").first().locator("summary").click();
  assert(
    await noJS
      .locator(".project-details")
      .first()
      .evaluate((el) => el.open),
  );
  await noOverflow(noJS, "JavaScript disabled");
  report.checks.push(
    "server-rendered content and native disclosures without JavaScript",
  );

  assert.deepEqual(report.consoleErrors, []);
  assert.deepEqual(report.requestFailures, []);
  fs.writeFileSync(
    "test-results/browser-report.json",
    JSON.stringify(report, null, 2),
  );
  console.log(
    "PASS motion, hover, touch, no-JS, links, optional URLs, metadata, share image, and zero browser errors",
  );
} catch (error) {
  fs.writeFileSync(
    "test-results/browser-report.json",
    JSON.stringify({ ...report, failure: error.message }, null, 2),
  );
  throw error;
} finally {
  await browser.close();
}
