# Yubo Zhao — Engineering & Intelligent Systems

A personal portfolio for Yubo Zhao, a University of Waterloo Software Engineering student building across AI, machine learning, computer vision, robotics, and experimental software. Phase 4 uses a charcoal-and-lime identity, editorial competition spreads, custom interactive system diagrams, a contrasting ML case study, and typographic honours.

## Stack

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4 with authored CSS, and Lucide icons. Motion uses CSS and IntersectionObserver; there is no animation framework, WebGL, or canvas runtime. Typography uses local Arial/Helvetica and Consolas fallbacks, with no font downloads.

Development checks use ESLint, TypeScript, Playwright Core, and axe-core. Use Node.js 22 or newer (validated with Node 24).

## Installation and development

```sh
npm ci
npm run dev
```

Open http://localhost:3000. On Windows with PowerShell script execution disabled, use `npm.cmd` instead of `npm`.

Copy `.env.example` to `.env.local` when configuring the public domain. Set `SITE_URL` to the actual HTTP(S) origin, without a path, query, or fragment. Leave it empty until a domain is chosen.

## Production

```sh
npm run typecheck
npm run lint
npm run build
npm start
```

The portfolio, robots, sitemap, favicon, and sharing image are prerendered. Stop the development server before validating the production server on the same port.

## Structure

```text
src/
  app/
    page.tsx                 Page order
    layout.tsx               Document, metadata, skip link
    globals.css              Tokens, type, shared controls, motion preferences
    icon.svg                 Vector favicon
    robots.ts / sitemap.ts   Domain-aware crawler metadata
    share-image/route.tsx     Prerendered 1200 × 630 sharing image
  data/
    profile.ts               All résumé content, projects, skills, links
    site.ts                  Public origin and SEO title/description
  components/
    navbar.tsx               Responsive navigation and focus management
    hero.tsx                 Identity and competition credentials
    system-visual.tsx        Interactive computational field
    motion-control.tsx       Ambient animation pause/resume
    content-sections.tsx     Profile, experience, projects, honours, skills, contact
    project-card.tsx         ProjectShowcase: flagship, case study, secondary
    jarvis-visual.tsx         Multimodal architecture
    project-visual.tsx        MRI, gesture, and world-state visualizations
    animated-section.tsx     Visible-on-server reveals and offscreen motion pause
    ui.tsx / footer.tsx       Shared presentation
  styles/
    navigation.css / hero.css / projects.css / sections.css
scripts/
  check-browser.mjs          Responsive, interaction, accessibility, production checks
```

## Profile content

Edit `src/data/profile.ts` for education, experience, honours, technologies, and project descriptions. Unknown facts stay absent: no IOAI ranking, internship performance claim, or invented medical metric is included. The gesture accuracy is explicitly scoped to the project's test split. The physics contest year is unset.

The page flows from Waterloo and competition credentials through IOAI, FTC, and quantitative research into the project exhibits. The old explorations section is folded into the focused project narrative.

Skills have three immediately visible entries per group and native keyboard/touch disclosures for the rest. Foundational skills retain their qualifications, including RAG, IMU, and sensor fusion.

## Defining and adding projects

Projects are typed records in `profile.projects`. Each has:

- `id`: unique stable slug, also used in `#project-<id>` anchors.
- `title`, `subtitle`, `category`, and `description`.
- `presentation`: `flagship`, `case-study`, or `secondary`; layout is explicit, independent of array position.
- `visual`: `intelligence`, `medical`, `gesture`, or `simulation`.
- `details`: engineering notes shown in a native disclosure.
- `technologies`: concise list of verified tools.
- Optional `evaluation` with a result and its measurement context.
- Optional `href` for a verified repository or demo.

Add a record to the array to render a new project. For a new visualization, extend the `Project["visual"]` union and `ProjectVisual` renderer, then add scoped styles in `projects.css`. Update the four-project count in the browser test when intentionally adding projects.

The visuals are architectural or illustrative studies, not product screenshots, patient data, live inference, or measured simulation outputs. Hero selectors link to the matching project or experience. Gesture selection shows 21-point landmark poses; world-state controls step and reset a deterministic illustration. No camera or microphone access is requested.

## Links and résumé

Configure `profile.socials` in `src/data/profile.ts`:

- Email: `bowenzhao2020@gmail.com` (store without `mailto:`).
- LinkedIn: `https://linkedin.com/in/yubozhao-ai`.
- GitHub: currently `null`.
- Résumé: currently `null`.

To add a résumé, create `public/resume.pdf` and set `resume: "/resume.pdf"`, or use a verified HTTPS URL. To add project destinations, set each project's `href`. Missing optional links are omitted, including their controls. No phone number is displayed.

## Metadata and deployment

`src/data/site.ts` holds the SEO title and description. Set `SITE_URL` in the deployment environment **before building**. It enables the canonical URL, OpenGraph URL/image, Twitter large-image card, and sitemap entry. Without it, descriptive metadata still renders, `/sitemap.xml` contains no guessed URL, and `/robots.txt` omits its sitemap line. The sharing image remains available at `/share-image`.

Deploy to a host with Next.js support, or a Node.js server:

1. Install with `npm ci`.
2. Configure `SITE_URL` and any real profile/project links.
3. Run `npm run build`.
4. Run `npm start` behind the host's HTTPS endpoint (or let the Next.js hosting integration serve the build).
5. Run the browser checks against the production URL.

For Vercel, import the repository as a Next.js project, keep the root directory at the repository root, set `SITE_URL`, and use `npm run build`. Publishing is a separate deployment action; this repository does not configure credentials or auto-deploy.

## Browser and accessibility checks

With a development or production server running:

```sh
npm run test:browser
```

Environment options:

- `BASE_URL`: defaults to `http://127.0.0.1:3000`.
- `BROWSER_PATH`: defaults to installed Chrome on Windows. Set the path to another installed Chromium browser on other operating systems. Playwright Core does not download a browser.

Tests cover 320, 375, 390, 430, 768, 1024, 1280, 1440, and 1920px; initial and expanded horizontal overflow; keyboard skip links/disclosures/diagram controls; mobile menu focus and Escape; touch interactions; hover; normal/reduced/paused motion; offscreen animation pause; console/network errors; layout shift; internal links; absent optional URLs; metadata; generated image dimensions; and content without JavaScript. axe-core checks WCAG A/AA rules at representative narrow, tablet, and desktop widths.

Screenshots and the structured report go to ignored `test-results/`. External social destinations are checked against the configured values; the suite does not send email or require third-party sites to accept automated requests.

Ambient motion can be paused in the hero and is disabled for reduced motion. Content is visible without JavaScript; project and skill disclosures use native HTML. User-selected controls change only illustrations. No scroll hijacking, custom cursor, heavy parallax, video, particle effects, or remote image/font requests are used.
