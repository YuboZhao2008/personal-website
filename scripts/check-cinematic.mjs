import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { chromium } from "playwright-core";
import { profile } from "../src/data/profile.ts";

const require = createRequire(import.meta.url);
const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";
const output = "test-results/cinematic";
const onlyAnchors = process.env.CINEMATIC_ONLY_ANCHORS === "1";
fs.mkdirSync(output, { recursive: true });
const report = { scenarios: [], anchorChecks: [], errors: [], requests: [] };
const browser = await chromium.launch({ executablePath: process.env.BROWSER_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const isolatedBackground = "main,header,footer,.motion-dock,.skip-link,nextjs-portal { visibility:hidden !important; }";
async function frames(page, count = 60) {
  await page.evaluate((total) => new Promise((resolve) => {
    let n = 0;
    function tick() { if (++n >= total) resolve(); else requestAnimationFrame(tick); }
    requestAnimationFrame(tick);
  }), count);
}
async function scroll(page, y) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  await frames(page, 75);
}
async function geometry(locator) {
  return locator.evaluate((el) => { const r = el.getBoundingClientRect(); return { top: r.top + scrollY, height: r.height }; });
}
async function galleryState(page) {
  return page.locator(".gallery-panel").evaluateAll((panels) => panels.map((el) => ({ project: el.dataset.project, active: el.dataset.active, transform: getComputedStyle(el).transform, opacity: getComputedStyle(el).opacity })));
}
async function journeyState(page) {
  return page.evaluate(() => ({
    progress: Number(document.querySelector("[data-journey-progress]").dataset.journeyProgress),
    offset: Number.parseFloat(getComputedStyle(document.querySelector(".journey-trace")).strokeDashoffset),
    x: document.querySelector(".journey-dot").transform.baseVal.consolidate().matrix.e,
    y: document.querySelector(".journey-dot").transform.baseVal.consolidate().matrix.f,
  }));
}
try {
  for (const [width, height] of (onlyAnchors ? [] : [[1440, 1000], [768, 1024], [390, 844]])) {
    for (const reducedMotion of ["no-preference", "reduce"]) {
      const label = `${width}-${reducedMotion === "reduce" ? "reduced" : "motion"}`;
      const page = await browser.newPage({ viewport: { width, height }, reducedMotion });
      page.on("pageerror", (error) => report.errors.push(error.message));
      page.on("console", (message) => { if (message.type() === "error") report.errors.push(message.text()); });
      page.on("requestfailed", (request) => report.requests.push({ url: request.url(), failure: request.failure() }));
      await page.addInitScript(() => {
        window.__cinematic = { cls: 0, lcp: 0 };
        new PerformanceObserver((list) => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cinematic.cls += e.value; }).observe({ type: "layout-shift", buffered: true });
        new PerformanceObserver((list) => { for (const e of list.getEntries()) window.__cinematic.lcp = e.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
      });
      await page.goto(baseURL, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await frames(page, 120);
      await page.screenshot({ path: `${output}/${label}-hero.png` });
      assert.equal(await page.locator(".gallery-panel").count(), profile.projects.length);
      assert.equal(await page.locator(".gallery-record").count(), profile.projects.length);
      for (const project of profile.projects) {
        const record = page.locator(`#project-${project.id}`);
        assert.equal(await record.count(), 1);
        assert((await record.textContent()).includes(project.description));
        assert(await record.locator("summary").first().isVisible());
      }
      const field = page.locator(".ambient-field");
      const backgroundA = await field.screenshot({ path: `${output}/${label}-background-a.png`, style: isolatedBackground });
      await frames(page, 75);
      const backgroundB = await field.screenshot({ path: `${output}/${label}-background-b.png`, style: isolatedBackground });
      const backgroundChanged = !backgroundA.equals(backgroundB);
      assert.equal(backgroundChanged, reducedMotion !== "reduce", `${label}: background must move at idle only with normal motion`);
      const scenario = { width, height, reducedMotion, backgroundChanged };
      if (reducedMotion !== "reduce") {
        await page.getByRole("button", { name: "Pause ambient motion" }).click();
        await frames(page, 10);
        const pausedA = await field.screenshot({ style: isolatedBackground });
        await frames(page, 60);
        const pausedB = await field.screenshot({ style: isolatedBackground });
        assert(pausedA.equals(pausedB), `${label}: global pause freezes isolated background pixels`);
        scenario.pausedBackgroundStatic = true;
        await page.getByRole("button", { name: "Resume ambient motion" }).click();
        await frames(page, 60);
      }
      scenario.idleFrameTiming = await page.evaluate(() => new Promise((resolve) => {
        const intervals = [];
        let previous;
        function tick(now) {
          if (previous !== undefined) intervals.push(now - previous);
          previous = now;
          if (intervals.length < 60) return requestAnimationFrame(tick);
          const sorted = [...intervals].sort((a, b) => a - b);
          const duration = intervals.reduce((sum, value) => sum + value, 0);
          resolve({ sampledFrames: intervals.length, estimatedFPS: 60000 / duration, medianMs: sorted[30], p95Ms: sorted[57], over40ms: intervals.filter((value) => value > 40).length });
        }
        requestAnimationFrame(tick);
      }));
      const journey = page.locator("[data-journey-progress]");
      const bounds = await geometry(journey);
      const journeyPositions = [Math.max(0, bounds.top - height * 0.85), bounds.top + bounds.height * 0.5 - height * 0.35, bounds.top + bounds.height - height * 0.2];
      const journeySamples = [];
      for (let index = 0; index < journeyPositions.length; index++) {
        await scroll(page, journeyPositions[index]);
        journeySamples.push(await journeyState(page));
        await page.screenshot({ path: `${output}/${label}-journey-${index}.png` });
      }
      await scroll(page, journeyPositions[0]);
      const journeyReversed = await journeyState(page);
      if (reducedMotion === "reduce") {
        assert.deepEqual(journeySamples[0], journeySamples[2], `${label}: reduced journey remains static`);
      } else {
        assert(journeySamples[2].progress > journeySamples[0].progress + 0.3, `${label}: journey progresses with scroll`);
        assert(journeySamples[2].offset < journeySamples[0].offset, `${label}: SVG path draws forward`);
        assert(Math.abs(journeySamples[2].x - journeySamples[0].x) + Math.abs(journeySamples[2].y - journeySamples[0].y) > 30, `${label}: luminous dot advances`);
        assert(Math.abs(journeyReversed.progress - journeySamples[0].progress) < 0.03, `${label}: journey reverses`);
      }
      scenario.journey = { samples: journeySamples, reversed: journeyReversed };
      const gallery = page.locator(".rolling-gallery");
      const mode = await gallery.getAttribute("data-mode");
      scenario.galleryMode = mode;
      if (mode === "desktop" && reducedMotion !== "reduce") {
        const track = await geometry(page.locator(".gallery-track"));
        const stage = await page.locator(".gallery-stage").boundingBox();
        const travel = track.height - stage.height;
        assert(travel > height, "Desktop gallery has a useful scrub interval");
        const gallerySamples = [];
        for (const progress of [0.1, 0.45, 0.85]) {
          await scroll(page, track.top + travel * progress);
          gallerySamples.push(await galleryState(page));
          await page.screenshot({ path: `${output}/${label}-gallery-${progress}.png` });
        }
        assert.notDeepEqual(gallerySamples[0], gallerySamples[1], "Gallery visibly interpolates through middle scroll positions");
        assert.notDeepEqual(gallerySamples[1], gallerySamples[2], "Gallery continues to interpolate toward its end");
        await scroll(page, track.top + travel * 0.1);
        const reversed = await galleryState(page);
        assert.equal(reversed.find((item) => item.active === "true")?.project, gallerySamples[0].find((item) => item.active === "true")?.project, "Reverse scroll restores the earlier project");
        const activeBeforePause = reversed.find((item) => item.active === "true")?.project;
        await page.getByRole("button", { name: "Pause ambient motion" }).click();
        await frames(page, 15);
        assert.equal(await gallery.getAttribute("data-mode"), "static");
        assert.equal((await galleryState(page)).find((item) => item.active === "true")?.project, activeBeforePause, "Pausing keeps the selected project");
        await page.getByRole("button", { name: "Resume ambient motion" }).click();
        await frames(page, 75);
        assert.equal((await galleryState(page)).find((item) => item.active === "true")?.project, activeBeforePause, "Resuming restores the selected project");
        scenario.gallery = { samples: gallerySamples, reversed, pauseRestoresActive: true };
      } else {
        const first = page.locator(".gallery-panel").first();
        const panel = await geometry(first);
        await scroll(page, Math.max(0, panel.top - height * 0.9));
        const before = await galleryState(page);
        await scroll(page, panel.top - height * 0.15);
        const after = await galleryState(page);
        await page.screenshot({ path: `${output}/${label}-gallery.png` });
        if (reducedMotion === "reduce") assert.deepEqual(before, after, "Reduced-motion gallery is static at all scroll positions");
        else assert.notDeepEqual(before, after, "Mobile panels respond visibly to scroll");
        scenario.gallery = { before, after };
      }
      // Both the cinematic layer and disclosure records must remain keyboard accessible.
      for (const button of await page.locator(".gallery-selector").all()) {
        await button.focus();
        await page.keyboard.press("Enter");
        await frames(page, 50);
        assert.equal(await button.getAttribute("aria-pressed"), "true");
      }
      const firstRecord = page.locator(".gallery-record").first();
      await firstRecord.locator("summary").first().focus();
      await page.keyboard.press("Enter");
      assert(await firstRecord.evaluate((el) => el.open));
      await firstRecord.locator("summary").first().focus();
      await page.keyboard.press("Enter");
      assert(!(await firstRecord.evaluate((el) => el.open)));
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      assert.equal(overflow, false, `${label}: no horizontal overflow`);
      await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
      scenario.accessibility = await page.evaluate(async () => {
        const result = await window.axe.run(document.body, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] } });
        return result.violations.map(({ id, impact, nodes }) => ({ id, impact, targets: nodes.map(({ target }) => target) }));
      });
      assert.deepEqual(scenario.accessibility, [], `${label}: accessibility`);
      scenario.performance = await page.evaluate(() => ({ ...window.__cinematic, resourceBytes: performance.getEntriesByType("resource").reduce((sum, entry) => sum + entry.transferSize, 0) }));
      assert(scenario.performance.cls < 0.1, `${label}: avoid layout shifts`);
      report.scenarios.push(scenario);
      console.log(`PASS ${label}: idle field, reversible journey/gallery, accessible projects; local LCP ${Math.round(scenario.performance.lcp)}ms; CLS ${scenario.performance.cls.toFixed(4)}`);
      await page.close();
    }
  }
  for (const reducedMotion of ["no-preference", "reduce"]) {
    for (const target of ["#contact", "#experience-ioai"]) {
    const anchorPage = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion });
    anchorPage.on("pageerror", (error) => report.errors.push(error.message));
    await anchorPage.goto(`${baseURL}/${target}`, { waitUntil: "networkidle" });
    if (reducedMotion !== "reduce") await anchorPage.waitForFunction(() => document.querySelector(".rolling-gallery")?.dataset.mode === "desktop");
    await frames(anchorPage, 90);
    const alignment = await anchorPage.locator(target).evaluate((element) => ({ top: element.getBoundingClientRect().top, expected: parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) + parseFloat(getComputedStyle(element).scrollMarginTop) }));
    assert(Math.abs(alignment.top - alignment.expected) < 3, `Incoming ${target} anchor must remain aligned after gallery initialization (${reducedMotion}): ${JSON.stringify(alignment)}`);
    report.anchorChecks.push({ target, reducedMotion, ...alignment });
    await anchorPage.close();
    }
  }
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.requests, []);
} catch (error) {
  report.failure = error.message;
  throw error;
} finally {
  fs.writeFileSync(`${output}/${onlyAnchors ? "anchor-report" : "report"}.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
