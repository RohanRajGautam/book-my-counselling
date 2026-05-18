# Book Your Counselling — Frontend

Next.js frontend for the BYC mentor-booking platform. Consumes the FastAPI backend at `NEXT_PUBLIC_API_URL`.

**Stack:** Next.js 16.2.4 (App Router) · React 19.2.4 · TypeScript 5 (strict + `noUncheckedIndexedAccess`) · Tailwind CSS v4 · TanStack Query v5 · axios · shadcn/ui (`base-nova` style) · framer-motion · sonner · next-themes.

For the mental model of how the code is organized, see [`ARCHITECTURE.md`](./ARCHITECTURE.md). For Next.js 16 / React 19 rules and project-specific conventions, see [`AGENTS.md`](./AGENTS.md) (also loaded by Claude via `CLAUDE.md`).

## Quick start

```bash
npm install
cp .env.example .env        # then point NEXT_PUBLIC_API_URL at a running backend
npm run dev                 # http://localhost:3000
```

Without a reachable backend at `NEXT_PUBLIC_API_URL`, every authenticated request will fail — bring the FastAPI service up first (default `http://localhost:8000/api/v1`).

## Scripts

| Command         | What it does                                          |
| --------------- | ----------------------------------------------------- |
| `npm run dev`   | Dev server on `:3000` (Turbopack is default in Next 16) |
| `npm run build` | Production build                                      |
| `npm run start` | Serve the production build                            |
| `npm run lint`  | ESLint via `eslint-config-next` (core-web-vitals + ts) |

No test runner is configured.

## Environment

| Variable              | Required | Default (dev)                       | Notes                                  |
| --------------------- | -------- | ----------------------------------- | -------------------------------------- |
| `NEXT_PUBLIC_API_URL` | yes      | `http://localhost:8000/api/v1`      | Base URL for the FastAPI backend       |

Preview and production values are set in the Vercel dashboard per environment (see comments in `.env.example`).

## Project layout

```
src/
├── app/              # App Router. Three route surfaces:
│   ├── (public)/         # marketing + booking funnel (Navbar + Footer)
│   ├── mentor/           # mentor dashboard (MentorAuthGate + sidebar)
│   └── admin/            # admin panel (AdminAuthGate)
├── features/         # All product code, one folder per domain.
│   └── <name>/{api,components,hooks,types,lib}
├── components/       # Cross-feature primitives:
│   ├── ui/               # shadcn/ui (base-nova)
│   ├── layout/           # Navbar, Footer, MentorNav
│   └── common/           # SectionContainer, AnimatedSection, etc.
├── lib/              # Shared infra
│   ├── api/              # apiClient (axios instance + auth interceptor)
│   ├── auth/             # localStorage token helpers
│   └── utils.ts
├── hooks/            # App-wide hooks (use-mobile)
└── types/            # Ambient/global TypeScript types
```

Route files under `src/app/**/page.tsx` are intentionally thin — they import a feature component (e.g. `BookingPageContent`) and render it. New product code goes under `src/features/<name>/`.

## Deployment

Deployed via Vercel. The `develop` branch builds to a preview env pointing at the dev API; `main` builds to production pointing at the prod API. Both URLs are configured as environment variables in the Vercel dashboard — keep `.env.example` in sync when the contract changes.

## Conventions

- Formatting: Prettier (no semicolons, single quotes, 2-space indent, 100-char width, `prettier-plugin-tailwindcss` sorts classes). Run your editor's Prettier integration; there is no commit hook.
- See [`AGENTS.md`](./AGENTS.md) for Next.js 16 rules (async `cookies()/headers()/params/searchParams`, `proxy.ts` replaces `middleware.ts`, fetch is no-cache by default, etc.) and project-specific conventions.
