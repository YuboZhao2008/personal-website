# Yubo Zhao — Personal Portfolio

An engineering portfolio showcasing work across software engineering, AI / machine learning, computer vision, robotics, and intelligent systems.

[Live Website](https://personal-website-one-pi-86.vercel.app) · [Architecture](#architecture) · [Run locally](#local-development) · [LinkedIn](https://linkedin.com/in/yubozhao-ai)

![Desktop view of Yubo Zhao's portfolio, with charcoal and lime typography, an interactive computational surface, and engineering highlights](docs/images/portfolio-desktop.png)

## Overview

Yubo Zhao's personal portfolio brings together projects, engineering experience, competition achievements, and technical skills as a Software Engineering student at the University of Waterloo. A single-page layout pairs project descriptions and engineering notes with custom SVG and CSS visualizations.

## Tech Stack

| Area                   | Technologies                                      |
| ---------------------- | ------------------------------------------------- |
| Framework              | Next.js 16 App Router, React 19                   |
| Language               | TypeScript with strict checking                   |
| Styling                | Tailwind CSS 4, authored CSS, Lucide icons        |
| Interaction and motion | React state, CSS animations, IntersectionObserver |
| Validation             | ESLint, TypeScript, Playwright Core, axe-core     |

## Highlights

- **Responsive layouts:** custom desktop and mobile compositions, with a native modal mobile navigation dialog that handles keyboard focus, Escape, and viewport changes.
- **Interactive technical illustrations:** a computational surface, multimodal architecture diagram, gesture landmark selector, and deterministic world-state controls. These illustrate the featured work; they do not run its AI models or process camera input.
- **Motion controls:** support for `prefers-reduced-motion`, an ambient animation pause/resume control, and offscreen animation pausing.
- **Content available without JavaScript:** prerendered portfolio content and native HTML disclosures for project notes and additional skills.
- **Structured content:** typed project records select their presentation and visualization, while shared components render experience, achievements, and skills.
- **Search and sharing metadata:** a generated 1200 × 630 sharing image, plus canonical and sitemap URLs derived from an optional configured origin.

## Architecture

```text
src/
├── app/          Page composition, layout, global CSS, metadata routes
├── components/   Sections, navigation, project displays, interactive diagrams
├── data/         Typed portfolio content and site configuration
└── styles/       Styles for navigation, hero, projects, and other sections
scripts/
└── check-browser.mjs   Browser and accessibility validation
docs/
└── images/       Curated README screenshots
```

[`src/app/page.tsx`](src/app/page.tsx) composes the page from reusable sections. Server Components render the content, with Client Components handling navigation, diagram state, and motion. The home page, crawler metadata, and sharing image are prerendered during the production build.

## Local Development

Use **Node.js 24** and npm, matching the validated development runtime. From the cloned repository:

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). `npm ci` installs the versions recorded in the lockfile. On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`.

No environment variables or API credentials are required. For local metadata testing, copy [`.env.example`](.env.example) to `.env.local` and set the optional `SITE_URL`.

## Production Build

```sh
npm run build
npm start
```

The production server uses [localhost:3000](http://localhost:3000). Stop any development server using that port first.

## Validation

```sh
npm run typecheck
npm run lint
npm run build
```

Type-checking generates Next.js route declarations before running TypeScript, so it also works before the first development server or build.

With a development or production server running, use a second terminal for browser validation:

```sh
npm run test:browser
```

Use the same `SITE_URL` value as the tested build when running the suite so metadata assertions match that build.

The suite checks nine viewport widths from 320 to 1920 pixels, horizontal overflow, keyboard and touch interactions, mobile focus isolation and restoration, disclosures, motion preferences, punctuation, optional links, diagram bounds and mobile label sizes, production metadata, browser errors, and content without JavaScript. axe-core scans representative mobile, tablet, and desktop widths for WCAG A/AA rule violations.

| Browser test option | Default / usage                                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `BASE_URL`          | `http://127.0.0.1:3000`; override to test another local port                                                              |
| `BROWSER_PATH`      | Standard Windows Chrome installation; set an absolute path to an installed Chrome or Chromium executable on other systems |

Playwright Core uses an existing browser and does not download one. Test screenshots and reports are written to ignored `test-results/`. The [README screenshot](docs/images/portfolio-desktop.png) is a curated copy of `test-results/hero-1440.png`; after a visual change, run the suite against a production build, review that capture, and copy it to `docs/images/portfolio-desktop.png`.

## Content Management

Edit [`src/data/profile.ts`](src/data/profile.ts) for profile information, education, projects, experience, achievements, skills, navigation links, and social destinations. Edit [`src/data/site.ts`](src/data/site.ts) for the site title, description, and origin handling.

Each project includes an ID, description, technologies, engineering notes, a `presentation` (`flagship`, `case-study`, or `secondary`), and a `visual` (`intelligence`, `medical`, `gesture`, or `simulation`). Optional `evaluation` data includes measurement context. `originalTitle` preserves a résumé project name when its display title is clarified.

When adding projects, update the section introduction and counter in `src/components/content-sections.tsx`; browser checks use the configured project count. Adding a new visualization also requires extending the `Project` type and `ProjectVisual` renderer. Shared section copy lives in the components.

| Configuration in `src/data/profile.ts`                                               | Behavior                                                                                            |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `profile.socials.resume`                                                             | HTTPS résumé URL or site-relative PDF path; enables **View Résumé** in the hero and contact section |
| `profile.socials.github`                                                             | Your verified GitHub profile URL; shown in contact                                                  |
| `profile.opportunity.targetRoles`                                                    | Concise areas of interest, shown subtly in contact                                                  |
| `profile.opportunity.status` / `availability`                                        | Optional confirmed opportunity status and availability text; no date is assumed                     |
| Project `repositoryUrl`, `demoUrl`, `caseStudyUrl`                                   | Optional evidence actions; only configured HTTPS destinations render                                |
| Achievement `verificationUrl`, `team`, `teamNumber`, `resultDetail`, `scope`, `year` | Optional verification and context; missing fields remain hidden                                     |

Keep unknown values `null` (or an empty `targetRoles` array). Evidence URLs are unset until the corresponding work is ready to share. The résumé is served from `public/resume.pdf` at `/resume.pdf`; replace that file to update it. Both résumé actions open in a new tab. Link handling is centralized in `src/data/links.ts`.

## Deployment

The project is prepared for Vercel's [Next.js integration](https://vercel.com/docs/frameworks/full-stack/nextjs). Import the GitHub repository using these settings:

| Setting           | Value                  |
| ----------------- | ---------------------- |
| Framework preset  | Next.js                |
| Root directory    | Repository root (`./`) |
| Node.js           | 24.x                   |
| Install command   | `npm ci`               |
| Build command     | `npm run build`        |
| Output directory  | Next.js default        |
| Production branch | `main`                 |

The intended workflow tracks `main` for production and uses previews for branch changes through [Vercel's Git integration](https://vercel.com/docs/git). Confirm the production branch in the Vercel project settings.

### Live website and public origin

The live site is linked at the top of this README. Production metadata consumes the existing `SITE_URL` environment variable at build time; the domain is not hardcoded in application components. Keep it set to the stable production HTTPS origin in Vercel's Production environment.

After changing the primary domain, update the README link, GitHub's **About → Website** field, and production `SITE_URL`, then create a new build to apply metadata changes.

`SITE_URL` is optional. When unset, the site still runs, `/share-image` remains available, and canonical URLs, absolute sharing-image metadata, and the sitemap entry are omitted. Set it before building to enable those URLs. Keep it unset in Preview unless previews should use the production canonical origin. If the primary domain changes later, update `SITE_URL` and both public links, then rebuild.
