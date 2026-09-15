import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { chromium } from "playwright-core";
import { profile, navigation } from "../src/data/profile.ts";
import { publicHref, projectEvidence } from "../src/data/links.ts";
import { site } from "../src/data/site.ts";

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

// Test-only fixtures: these URLs are never included in portfolio content.
for (const invalid of [
  null,
  "",
  "#",
  "javascript:alert(1)",
  "file:///resume.pdf",
  "C:/private/resume.pdf",
  "https://user:pass@example.test",
  "not-a-url",
]) {
  assert.equal(publicHref(invalid), null);
  assert.equal(publicHref(invalid, true), null);
}
assert.equal(publicHref("/resume.pdf", true), "/resume.pdf");
assert.equal(publicHref("//example.test/resume.pdf", true), null);
assert.equal(
  publicHref("https://example.test/resume.pdf", true),
  "https://example.test/resume.pdf",
);
assert.deepEqual(projectEvidence({}), []);
assert.deepEqual(
  projectEvidence({ repositoryUrl: "#", demoUrl: "javascript:alert(1)" }),
  [],
);
assert.deepEqual(
  projectEvidence({
    repositoryUrl: "https://example.test/source",
    demoUrl: "https://example.test/demo",
    caseStudyUrl: "https://example.test/study",
  }),
  [
    { label: "Repository", href: "https://example.test/source" },
    { label: "Demo", href: "https://example.test/demo" },
    { label: "Case study", href: "https://example.test/study" },
  ],
);

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
async function focused(locator) {
  assert(
    await locator.evaluate((el) => el === document.activeElement),
    "Unexpected keyboard focus",
  );
  assert(
    await locator.evaluate(
      (el) => getComputedStyle(el).outlineStyle !== "none",
    ),
    "Keyboard focus is not visibly outlined",
  );
}
async function disclosureAccessibility(page, count, expanded) {
  // Native summary exposes expanded state in Chromium's accessibility tree;
  // Playwright's text snapshot currently omits the DisclosureTriangle role.
  const session = await page.context().newCDPSession(page);
  try {
    const { nodes } = await session.send("Accessibility.getFullAXTree");
    const summaries = nodes.filter(
      (node) => node.role?.value === "DisclosureTriangle",
    );
    assert.equal(summaries.length, count);
    for (const summary of summaries)
      assert.equal(
        summary.properties.find((property) => property.name === "expanded")
          ?.value.value,
        expanded,
      );
  } finally {
    await session.detach();
  }
}

async function mobileKeyboardNavigation(page, width) {
  const trigger = page.getByRole("button", {
    name: "Open navigation",
    exact: true,
  });
  const dialog = page.getByRole("dialog", { name: "Mobile navigation" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await dialog.waitFor();
  const links = dialog.getByRole("navigation").getByRole("link");
  assert.equal(await links.count(), navigation.length);
  await focused(links.first());
  // Exact reported regression: opening with Enter followed by forward Tab.
  for (let i = 1; i < navigation.length; i++) {
    await page.keyboard.press("Tab");
    await focused(links.nth(i));
    assert.equal(await trigger.getAttribute("aria-expanded"), "true");
  }
  // Chromium may include browser chrome in a native dialog's Tab cycle.
  // It must never focus a background page control, and must return to the dialog.
  for (let i = 0; i < 2; i++) {
    await page.keyboard.press("Tab");
    assert(
      await page.evaluate(
        () =>
          !document.querySelector("main").contains(document.activeElement) &&
          !document.querySelector("header").contains(document.activeElement) &&
          document.activeElement !== document.querySelector(".skip-link"),
      ),
    );
    if (
      await dialog
        .getByRole("button", { name: "Close navigation" })
        .evaluate((el) => el === document.activeElement)
    )
      break;
  }
  await focused(dialog.getByRole("button", { name: "Close navigation" }));
  await page.keyboard.press("Shift+Tab");
  await focused(links.last());
  for (let i = navigation.length - 2; i >= 0; i--) {
    await page.keyboard.press("Shift+Tab");
    await focused(links.nth(i));
  }
  await page.keyboard.press("Shift+Tab");
  await focused(dialog.getByRole("button", { name: "Close navigation" }));
  await page.keyboard.press("Tab");
  await focused(links.first());
  // Native modality must also block programmatic focus into background content.
  await page
    .locator('.hero-actions a[href="#projects"]')
    .evaluate((el) => el.focus());
  await focused(links.first());
  assert(await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth));
  assert.deepEqual(
    await accessibility(page),
    [],
    "Accessibility failures in open mobile navigation",
  );
  if (width === 390)
    await page.screenshot({ path: "test-results/mobile-menu-390.png" });
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden" });
  assert.equal(await trigger.getAttribute("aria-expanded"), "false");
  await focused(trigger);
  // Activate every destination with the keyboard, without a mouse/focus shortcut.
  for (let i = 0; i < navigation.length; i++) {
    await trigger.focus();
    await page.keyboard.press(i % 2 ? "Space" : "Enter");
    await dialog.waitFor();
    for (let n = 0; n < i; n++) await page.keyboard.press("Tab");
    await focused(links.nth(i));
    await page.keyboard.press("Enter");
    await dialog.waitFor({ state: "hidden" });
    assert.equal(await trigger.getAttribute("aria-expanded"), "false");
    assert(
      await page
        .locator(navigation[i].href)
        .evaluate((el) => el === document.activeElement),
    );
  }
  // Mouse opening/closing remains supported.
  await trigger.click();
  await dialog.getByRole("button", { name: "Close navigation" }).click();
  await dialog.waitFor({ state: "hidden" });
  assert(await trigger.evaluate((el) => el === document.activeElement));
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
    assert.equal(
      await page.locator(".project-showcase").count(),
      profile.projects.length,
    );
    await noOverflow(page, width + "px initial");
    const visibleText = await page.locator("body").innerText();
    assert(
      !/[A-Za-z]\?[A-Za-z]|\uFFFD|Ã.|Â.|â€/.test(visibleText),
      "Corrupted visible punctuation",
    );
    assert.equal(
      await page.getByRole("heading", { name: /Let’s build/ }).count(),
      1,
    );
    assert(visibleText.includes("I’d like to hear about it."));
    const accessibleText = await page.locator("main").ariaSnapshot();
    assert(
      !/Let\?s|I\?d|\uFFFD/.test(accessibleText),
      "Corrupted accessible text",
    );
    for (const diagram of await page
      .locator(".project-visual svg, .field-svg, .world-grid")
      .all()) {
      assert(
        await diagram.evaluate((el) => {
          const r = el.getBoundingClientRect();
          const p = el
            .closest(".project-visual, .system-visual")
            .getBoundingClientRect();
          return (
            r.width === 0 || (r.left >= p.left - 1 && r.right <= p.right + 1)
          );
        }),
        "Diagram extends outside its container",
      );
    }
    if (width <= 600) {
      const labels = page.locator(
        ".visual-topline, .jarvis-inputs .mono, .jarvis-engine > .mono, .jarvis-context > div, .jarvis-output, .slice-caption, .ml-pipeline strong, .evaluation-lenses, .gesture-state, .gesture-plane-label, .world-branches, .simulation-controls > span, .motion-control",
      );
      for (const label of await labels.all())
        assert(
          await label.evaluate(
            (el) => parseFloat(getComputedStyle(el).fontSize) >= 12,
          ),
          "Essential mobile label is too small",
        );
    }

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
      await mobileKeyboardNavigation(page, width);
    } else {
      const desktopLinks = page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link");
      await desktopLinks.first().focus();
      for (let i = 0; i < navigation.length; i++) {
        await focused(desktopLinks.nth(i));
        if (i < navigation.length - 1) await page.keyboard.press("Tab");
      }
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
    await disclosureAccessibility(page, await disclosures.count(), true);
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
    await disclosureAccessibility(page, await disclosures.count(), false);
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
      pageHeight: await page.evaluate(
        () => document.documentElement.scrollHeight,
      ),
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
    if (!link.href.startsWith("#") && !link.href.startsWith("mailto:"))
      assert.equal(
        publicHref(link.href, true),
        link.href,
        "Invalid configured destination",
      );
  }
  if (profile.socials.email)
    assert(links.some((l) => l.href === `mailto:${profile.socials.email}`));
  for (const key of ["linkedin", "github"]) {
    const href = publicHref(profile.socials[key]);
    if (href) assert(links.some((link) => link.href === href));
    else if (key === "github")
      assert.equal(
        await page
          .locator(".contact-links")
          .getByRole("link", { name: /GitHub/ })
          .count(),
        0,
      );
  }
  const resumeLinks = page.getByRole("link", {
    name: "View Résumé",
    exact: true,
  });
  const resume = publicHref(profile.socials.resume, true);
  assert.equal(await resumeLinks.count(), resume ? 2 : 0);
  for (const link of await resumeLinks.all())
    assert.equal(await link.getAttribute("href"), resume);
  for (const project of profile.projects) {
    const evidence = page.locator(`#project-${project.id} .project-link`);
    const expected = projectEvidence(project);
    assert.equal(await evidence.count(), expected.length);
    for (let i = 0; i < expected.length; i++)
      assert.equal(
        await evidence.nth(i).getAttribute("href"),
        expected[i].href,
      );
  }
  for (const achievement of profile.achievements) {
    const evidence = page.locator(
      `.honour-${achievement.id} .achievement-verification`,
    );
    const href = publicHref(achievement.verificationUrl);
    assert.equal(await evidence.count(), href ? 1 : 0);
    if (href) assert.equal(await evidence.getAttribute("href"), href);
  }
  const opportunityText = await page.locator("#contact").innerText();
  if (profile.opportunity.availability)
    assert(opportunityText.includes(profile.opportunity.availability));
  else assert(!opportunityText.includes("Availability:"));
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
  const canonical = page.locator('link[rel="canonical"]');
  const ogUrl = page.locator('meta[property="og:url"]');
  const ogImage = page.locator('meta[property="og:image"]');
  if (site.url) {
    assert.equal(
      new URL(await canonical.getAttribute("href")).href,
      `${site.url}/`,
    );
    assert.equal(
      new URL(await ogUrl.getAttribute("content")).href,
      `${site.url}/`,
    );
    assert.equal(
      await ogImage.getAttribute("content"),
      `${site.url}/share-image`,
    );
  } else {
    assert.equal(await canonical.count(), 0);
    assert.equal(await ogUrl.count(), 0);
    assert.equal(await ogImage.count(), 0);
  }
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
    if (path === "/sitemap.xml") {
      const xml = await res.text();
      assert(!(xml.includes("localhost") || xml.includes("127.0.0.1")));
      if (site.url) assert(xml.includes(`<loc>${site.url}</loc>`));
      else assert(!xml.includes("<loc>"));
    }
    if (path === "/robots.txt") {
      const robots = await res.text();
      if (site.url) assert(robots.includes(`Sitemap: ${site.url}/sitemap.xml`));
      else assert(!robots.includes("Sitemap:"));
    }
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
    "reviewer regression: mobile keyboard opening, forward/reverse Tab, Escape, focus return, all destinations, punctuation, diagram bounds and label sizes, optional links, production origin",
  );

  const noJS = await browser.newPage({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  await noJS.goto(baseURL);
  assert.equal(
    await noJS.locator(".project-showcase").count(),
    profile.projects.length,
  );
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
