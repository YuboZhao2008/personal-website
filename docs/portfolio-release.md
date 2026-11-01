# Portfolio refinement

The portfolio now uses direct, named project selection instead of a long pinned scroll gallery. An interactive observation/action diagram introduces the Warcraft environment; responsive vector studies introduce each project. Native scrolling, reduced motion, keyboard access, existing project disclosures and demonstrations, resume and social links are preserved.

Project order is Warcraft III RL Agent, Brain Tumor MRI Classification, Jarvis, RoomRead, Gesture-Controlled Drawing Interface, Future-Sim. Stable project IDs are unchanged.

## Verification

Run `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run test:browser`. The browser script accepts `BASE_URL`, `BROWSER_PATH` and comma-separated `BROWSER_VIEWPORTS`. Install the matching Playwright Chromium runtime or set `BROWSER_PATH` to an existing Chromium executable.

The production browser suite checks project order, selection, native scrolling, every project deep link, Back/Forward, modal focus and Escape, reduced motion, pause/resume, no-JavaScript fallback, existing gesture and simulation controls, resume and social links, SEO routes, and expanded diagrams. Layout checks cover 320–1920 CSS pixels, short/landscape screens, CSS zoom up to 200%, and touch emulation. Axe accessibility checks run with all project notes open at 320, 768 and 1440px. Emulation does not replace physical-device testing.

## Dependency remediation

Next.js and its matching ESLint configuration were updated from 16.3.8 to 16.4.3. This compatible release is beyond the 16.4.1 security fix boundary documented in the official [image optimization advisory](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw) and [cache advisory](https://github.com/vercel/next.js/security/advisories/GHSA-673q-mjm6-r5xr). The development-only Zod dependency was updated from 4.6.5 to 4.6.7 within its existing compatible range.

The release audit reports zero production vulnerabilities and no high or critical vulnerabilities overall. Sixteen moderate development-tool findings remain through minimatch 3.1.5 / 10.2.6 and the ESLint dependency chain. They are outside the production dependency graph. The suggested global force fix would change major tooling contracts, so it is deliberately excluded from this visual release.
