import { chromium } from "playwright-core";
import fs from "node:fs";

(async () => {
  fs.mkdirSync("test-results", { recursive: true });
  const browser = await chromium.launch({
    executablePath:
      process.env.BROWSER_PATH ||
      "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
  });
  const errors = [];
  for (const width of [1920, 1440, 1280, 1024, 768, 430, 390, 375, 320]) {
    const page = await browser.newPage({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    const response = await page.goto("http://localhost:3000", {
      waitUntil: "networkidle",
    });
    if (response.status() !== 200) throw new Error(`HTTP ${response.status()}`);
    await page.getByRole("heading", { level: 1 }).waitFor();
    const activeMotion = await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter((animation) => animation.playState === "running").length,
    );
    if (activeMotion)
      throw new Error(`Reduced-motion animations running at ${width}px`);
    const dimensions = await page.evaluate(() => ({
      width: innerWidth,
      scroll: document.documentElement.scrollWidth,
      sections: document.querySelectorAll("main > section").length,
    }));
    if (dimensions.scroll > width || dimensions.sections !== 8)
      throw new Error(`Layout failure ${JSON.stringify(dimensions)}`);
    if (width < 600) {
      const menu = page.getByRole("button", { name: "Open navigation" });
      await menu.click();
      await page.keyboard.press("Escape");
      if (
        (await menu.getAttribute("aria-expanded")) !== "false" ||
        !(await menu.evaluate((el) => el === document.activeElement))
      )
        throw new Error("Escape focus failed");
      await menu.click();
      await page
        .getByRole("navigation")
        .getByRole("link", { name: "Projects", exact: true })
        .click();
      if ((await menu.getAttribute("aria-expanded")) !== "false")
        throw new Error("Menu did not close");
      if (!page.url().endsWith("#projects"))
        throw new Error("Navigation failed");
      if (
        !(await page
          .locator("#projects")
          .evaluate((el) => el === document.activeElement))
      )
        throw new Error("Mobile navigation did not transfer focus to content");
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({
      path: `test-results/viewport-${width}.png`,
      fullPage: true,
    });
    await page.screenshot({ path: `test-results/hero-${width}.png` });
    const notes = page.locator(".project-details");
    for (let index = 0; index < (await notes.count()); index++) {
      const summary = notes.nth(index).locator("summary");
      await summary.focus();
      await page.keyboard.press("Enter");
      if (!(await notes.nth(index).evaluate((el) => el.open)))
        throw new Error("Project notes did not open with keyboard");
    }
    if (
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      )
    )
      throw new Error(`Expanded project overflow at ${width}px`);
    if (width === 1440 || width === 390) {
      await page
        .locator("#projects")
        .screenshot({
          path: `test-results/projects-expanded-${width}.png`,
          style:
            ".site-header, .skip-link, nextjs-portal { visibility: hidden !important; }",
        });
      await page
        .locator("#experience")
        .screenshot({
          path: `test-results/experience-${width}.png`,
          style:
            ".site-header, .skip-link, nextjs-portal { visibility: hidden !important; }",
        });
      await page
        .locator("#achievements")
        .screenshot({
          path: `test-results/achievements-${width}.png`,
          style:
            ".site-header, .skip-link, nextjs-portal { visibility: hidden !important; }",
        });
    }
    console.log(
      `PASS ${width}px: no overflow, all sections, HTTP 200${width < 600 ? ", mobile navigation and Escape focus" : ""}`,
    );
    await page.close();
  }
  const page = await browser.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  if (
    (await page.evaluate(() => document.activeElement.textContent)) !==
    "Skip to content"
  )
    throw new Error("Skip link is not first focus target");
  const brokenAnchors = await page.evaluate(() =>
    [...document.querySelectorAll('a[href^="#"]')]
      .filter((a) => !document.getElementById(a.hash.slice(1)))
      .map((a) => a.hash),
  );
  const experienceTitles = await page
    .locator("#experience h3")
    .allTextContents();
  if (
    !experienceTitles[0].includes("International Olympiad") ||
    experienceTitles[1] !== "Quantitative internship"
  )
    throw new Error("Experience editorial order changed");
  if (
    !(await page
      .locator(".project-evaluation")
      .textContent()
      .then((text) => text.includes("custom gesture dataset")))
  )
    throw new Error("Test accuracy lacks dataset context");
  if (brokenAnchors.length || errors.length)
    throw new Error(JSON.stringify({ brokenAnchors, errors }));
  console.log(
    "PASS keyboard disclosures and skip link, section anchors, experience ordering, scoped accuracy, and no browser runtime errors",
  );
  const motionPage = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "no-preference",
  });
  motionPage.on("pageerror", (error) => errors.push(error.message));
  motionPage.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await motionPage.goto("http://localhost:3000", { waitUntil: "networkidle" });
  const surface = motionPage.locator(".glow-surface");
  await surface.hover();
  await motionPage.waitForFunction(() =>
    document.querySelector(".glow-surface").hasAttribute("data-lit"),
  );
  await motionPage.mouse.move(0, 0);
  if ((await surface.getAttribute("data-lit")) !== null)
    throw new Error("Pointer light failed to reset");
  await motionPage.emulateMedia({ reducedMotion: "reduce" });
  await surface.hover();
  if ((await surface.getAttribute("data-lit")) !== null)
    throw new Error("Pointer light activated with reduced motion");
  await motionPage.emulateMedia({ reducedMotion: "no-preference" });
  await motionPage.locator("#projects").scrollIntoViewIfNeeded();
  await motionPage.locator(".project-featured").hover();
  await motionPage.waitForFunction(
    () =>
      document.querySelector(".project-featured").getBoundingClientRect()
        .width > 0,
  );
  await motionPage.setViewportSize({ width: 390, height: 844 });
  await motionPage.getByRole("button", { name: "Open navigation" }).click();
  await motionPage
    .getByRole("navigation")
    .getByRole("link", { name: "Skills", exact: true })
    .click();
  if (!motionPage.url().endsWith("#skills"))
    throw new Error("Animated mobile navigation failed");
  await motionPage.getByRole("button", { name: "Open navigation" }).click();
  await motionPage.keyboard.press("Escape");
  if (
    (await motionPage
      .getByRole("button", { name: "Open navigation" })
      .getAttribute("aria-expanded")) !== "false"
  )
    throw new Error("Animated Escape failed");
  const touchPage = await browser.newPage({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: "no-preference",
  });
  await touchPage.goto("http://localhost:3000", { waitUntil: "networkidle" });
  if (
    (await touchPage
      .locator(".pointer-light")
      .evaluate((el) => getComputedStyle(el).display)) !== "none"
  )
    throw new Error("Pointer effect is visible on touch devices");
  await touchPage.getByRole("button", { name: "Open navigation" }).tap();
  await touchPage
    .getByRole("navigation")
    .getByRole("link", { name: "Projects", exact: true })
    .tap();
  if (!touchPage.url().endsWith("#projects"))
    throw new Error("Touch navigation failed");
  if (errors.length) throw new Error(JSON.stringify(errors));
  console.log(
    "PASS normal-motion navigation, desktop pointer light, reduced-motion light suppression, and touch navigation",
  );
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
