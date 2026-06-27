# Finanshels website

Marketing site for [Finanshels](https://finanshels.com): products, solutions, and company pages.

## Tech stack

- **Next.js 15** (App Router) — deployed on **Vercel**
- **React 18** (mixed `.jsx` marketing screens + **TypeScript** for CMS layer)
- **Tailwind CSS** + **Typography** plugin
- **Firestore (GCP)** via **Firebase Admin** for `/blog` and `/glossary`
- **Zod** for content validation, **sanitize-html** for CMS HTML

See **[docs/cms-firestore.md](docs/cms-firestore.md)** for collections and revalidation.

## CMS admin panel (marketing)

- `/admin/login` — password login (`CMS_ADMIN_PASSWORD`)
- `/admin/cms` — multi-collection CMS with collection-specific fields and templates
- `/admin/onboarding` — gamified employee onboarding flow (auth-gated)
- SEO/GEO/AEO built into every collection editor section
- `GET /llms.txt` publishes machine-readable canonical links for AI answer engines.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # run production server
```

## Firebase setup (Firestore CMS)

1) Install CLI locally when needed:

```bash
npm i -D firebase-tools
```

2) Login and set your project:

```bash
npm run firebase:login
npm run firebase:use
```

3) Deploy Firestore rules + indexes:

```bash
npm run firebase:deploy
```

4) Add service-account envs in `.env.local` (and Vercel envs in production):

- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`

## Project structure

```
src/
├── app/                 # Next.js routes (layout, pages, API, /admin)
│   ├── (homepage-variants)/  # /home2, /home3, /home4 (URL-transparent route group)
│   ├── content/         # Generic detail page for every routed CMS collection
│   └── admin/           # Auth-gated CMS + employee onboarding
├── screens/             # Page-level UI, one file per marketing page
├── components/
│   ├── layout/          # Navbar, Footer, AppChrome, CookieConsent
│   ├── marketing/       # Reusable animated/section components
│   ├── cms/             # CMS admin + page-block renderers
│   └── ui/              # Primitives (Button, Card)
├── content/             # Typed static page data (team, products, service-pages…)
├── contexts/            # React context providers (onboarding)
├── hooks/               # Reusable hooks
├── lib/                 # Utilities, CMS repositories, landing-pages system
├── styles/globals.css   # Global styles (imported in app/layout.tsx)
└── middleware.ts        # Admin-route auth guard
```

More detail for contributors lives in **[CLAUDE.md](CLAUDE.md)** ("Where things live").

## Links

- Website: [https://finanshels.com](https://finanshels.com)
- LinkedIn: [https://linkedin.com/company/finanshels](https://linkedin.com/company/finanshels)

© Finanshels. All rights reserved.
