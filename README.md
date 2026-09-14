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

Browser smoke checks: with the dev server running, use `node scripts/check-browser.mjs`. This checks five viewport widths, overflow, navigation, keyboard behavior, and runtime errors, and saves screenshots to `test-results/`. It uses installed Chrome on Windows; set `BROWSER_PATH` for another Chrome/Chromium executable.

## Content and architecture

- `src/data/profile.ts`: profile, navigation, education, experience, project slots, skill areas, achievements, explorations, and nullable social/résumé links. Replace the null links with verified URLs; email takes an address without `mailto:`. Add a résumé to `public/resume.pdf` and set its link to `/resume.pdf`, or use an external URL.
- `src/app/page.tsx`: composition of all nine sections.
- `src/app/layout.tsx`: document, metadata, global stylesheet, and skip link.
- `src/app/globals.css`: design tokens, responsive layouts, component styles, CSS illustrations, and reduced-motion overrides; Tailwind is also available for utilities.
- `src/components`: reusable navigation, hero, section headings, buttons, badges, timeline, project cards, achievement cards, footer, and animation wrapper.

Most content renders through server components. Only navigation and the reusable motion wrapper are client components. Artwork is lightweight CSS/SVG with no image downloads. Motion respects the device's reduced-motion setting. The mobile navigation supports Escape and keyboard focus; configured external links open with `noopener noreferrer`.

Profile content includes Jarvis, the Hand Gesture Computer Vision System, Future Simulation, IOAI experience, a quantitative internship, the 2024 FTC World Championship second-place team result, and a 2025 CSMC score of 48/60. Project engineering notes expand with native accessible disclosures. The gesture project's approximately 98% test accuracy is scoped to custom-dataset testing, not real-world performance.

IOAI and FTC use shared structured experience records so their years and results stay consistent in the achievement cards. Unknown fields (IOAI year/team/placement and quantitative internship organization/dates) remain null and are not rendered. Update the relevant record at the top of `src/data/profile.ts` when details are available. Experience order deliberately places IOAI before the quantitative internship, then FTC and education.

Skills separate programming foundations, AI/ML project experience, development tools, and technologies used in this portfolio. Conceptual project artwork is labeled as such; it is not a screenshot of a working application. Add project `href` values for repository or demo links. Social and résumé links remain configurable. No additional runtime dependencies were needed for this content phase.
