# Yubo Zhao — Portfolio

A dark, responsive portfolio foundation built with Next.js App Router, React, TypeScript, Tailwind CSS v4, Framer Motion, and Lucide. Typography uses local system fonts, so builds do not depend on a font service.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000. In Windows PowerShell with script execution disabled, use `npm.cmd run dev` (and `npm.cmd` for the other commands).

## Validation

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

Browser smoke checks: with the dev server running, use `node scripts/check-browser.mjs`. This checks nine viewport widths (320, 375, 390, 430, 768, 1024, 1280, 1440, 1920), overflow, navigation, keyboard disclosures, console/runtime errors, normal and reduced motion, and touch interaction. Screenshots are saved to `test-results/`. It uses installed Chrome on Windows; set `BROWSER_PATH` for another Chrome/Chromium executable.

## Content and architecture

- `src/data/profile.ts`: profile, navigation, education, experience, project slots, skill areas, achievements, explorations, and nullable social/résumé links. Replace the null links with verified URLs; email takes an address without `mailto:`. Add a résumé to `public/resume.pdf` and set its link to `/resume.pdf`, or use an external URL.
- `src/app/page.tsx`: composition of all nine sections.
- `src/app/layout.tsx`: document, metadata, global stylesheet, and skip link.
- `src/app/globals.css`: shared design tokens, typography, controls, and reduced-motion overrides; Tailwind is also available for utilities. `src/styles/` contains consolidated navigation, hero, project, and section styles, including their responsive rules.
- `src/components`: reusable navigation, hero, section headings, buttons, badges, timeline, project cards, achievement cards, footer, and animation wrapper.

Most content renders through server components. Navigation, the reusable motion wrapper, and the isolated hero pointer light are client components. Artwork is lightweight CSS/SVG with no image downloads. Motion respects the device's reduced-motion setting. The mobile navigation supports Escape, keyboard focus, and focus transfer to the selected section; configured external links open with `noopener noreferrer`.

Profile content includes Jarvis, the Hand Gesture Computer Vision System, Future Simulation, IOAI experience, a quantitative internship, the 2024 FTC World Championship second-place team result, and a 2025 CSMC score of 48/60. Project engineering notes expand with native accessible disclosures. The gesture project's approximately 98% test accuracy is scoped to custom-dataset testing, not real-world performance.

IOAI and FTC use shared structured experience records so their years and results stay consistent in the achievement cards. Unknown fields (IOAI year/team/placement and quantitative internship organization/dates) remain null and are not rendered. Update the relevant record at the top of `src/data/profile.ts` when details are available. Experience order deliberately places IOAI before the quantitative internship, then FTC and education.

Skills separate programming foundations, AI/ML project experience, development tools, and technologies used in this portfolio. Conceptual project artwork is labeled as such; it is not a screenshot of a working application. Add project `href` values for repository or demo links. Social and résumé links remain configurable. No additional runtime dependencies were needed for this content phase.

## Phase 3 presentation

Jarvis uses the featured project layout and a server-rendered six-module concept diagram (`jarvis-visual.tsx`). Shared gesture and simulation illustrations live in `project-visual.tsx`. The first project in the data array is featured. No factual profile data changed during this phase.

The existing hero diagram has a four-second arrival signal, then settles. Other previews respond briefly to hover/focus rather than running continuous animation. `glow-surface.tsx` attaches pointer events to only the hero illustration; it schedules a single transform update per animation frame while the pointer moves, and suppresses the light for touch and reduced motion. There are no perpetual JavaScript animation loops, canvas effects, new dependencies, or remote fonts. Content is visible in server HTML, and reduced-motion CSS also overrides entrance transforms.

Navigation uses IntersectionObserver for its active section and scrolled appearance. The desktop experience heading uses CSS sticky positioning; timeline entries reveal independently without scroll progress calculations. Skills use grouped text lists, and the lab uses a shared status panel instead of another grid of independent cards.
