# Architecture

This document describes how the BYC frontend is organized so that a developer can locate things and make changes without reading 20 files first. Pair with [`AGENTS.md`](./AGENTS.md) for Next.js 16 / React 19 rules and project-specific guardrails.

## Overview

A Next.js 16 App Router frontend for a mentor-booking platform. Three distinct user surfaces (public marketing/booking, mentor dashboard, admin panel) share a single FastAPI backend, accessed through one shared axios client. Auth is JWT held in `localStorage`. Data fetching is **only** TanStack Query — there is no Redux/Zustand/Jotai. Forms are hand-rolled — there is no react-hook-form or zod. UI is shadcn/ui (`base-nova` style) on Tailwind v4 with Material 3-flavored design tokens.

## Route surfaces

Three top-level layouts in `src/app/` define the three product surfaces. Each has its own chrome and auth posture.

| Path under `src/app/` | Layout                                                                 | Wrapping                                         |
| --------------------- | ---------------------------------------------------------------------- | ------------------------------------------------ |
| `(public)/`           | `src/app/(public)/layout.tsx`                                          | `<Navbar />` + children + `<Footer />`           |
| `mentor/`             | `src/app/mentor/layout.tsx`                                            | `MentorAuthGate` → `SidebarProvider` → `MentorSidebar` + `MentorMobileHeader` |
| `admin/`              | `src/app/admin/layout.tsx`                                             | `AdminAuthGate` only                             |

The root layout (`src/app/layout.tsx`) loads two Google fonts (`Plus_Jakarta_Sans` as headline, `Manrope` as body), injects Microsoft Clarity + Google Analytics via `next/script` (`strategy="afterInteractive"`), and mounts `<Providers>` (TanStack Query + next-themes) and the `sonner` `<Toaster>` (top-right, rich colors).

**Route files are thin.** A page like `src/app/(public)/booking/page.tsx` typically just imports the feature page component (`BookingPageContent`) and renders it. Don't put business logic in `page.tsx`/`layout.tsx`.

The `reset-password/` segment lives at the root of `src/app/` (outside the three groups) so it remains reachable without auth or marketing chrome.

## Feature-based source layout

All product code lives in `src/features/<name>/`. Each feature folder follows the same shape:

```
features/<name>/
├── api/         # axios request functions (use the shared apiClient)
├── components/  # feature-scoped React components
├── hooks/       # TanStack Query hooks wrapping api/
├── types/       # feature TypeScript types
└── lib/         # constants, validation, helpers (optional)
```

The 24 existing features, grouped by domain:

- **Identity:** `auth`, `users`
- **Mentor surfaces:** `mentors`, `mentor-dashboard`, `my-sessions`, `earnings`, `profile-settings`, `availability`, `service-packages`
- **Discovery:** `explore-mentors`, `categories`, `industries`, `tags`, `filters`, `reviews`
- **Booking funnel:** `booking`, `dashboard`
- **Onboarding:** `counsellor-application`
- **Admin:** `admin`
- **Marketing pages:** `home`, `about`, `how-it-works`, `school-to-startup`, `privacy`

New product code should land in one of these folders or in a new feature folder following the same shape — not in `src/app/**` directly.

## HTTP layer

### The shared axios client

`src/lib/api/api-client.ts` exports a **single** axios instance:

```ts
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  paramsSerializer: { indexes: null },
})

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers['Authorization'] = `Bearer ${token}`
  return config
})
```

Every feature `api/` module imports this client. **Don't instantiate a second axios** — you'd lose the auth interceptor and the consistent baseURL.

### Pagination

List endpoints return a `PaginatedResponse<T>` from `src/lib/api/api.types.ts`:

```ts
{ items: T[]; total; page; page_size; total_pages; has_next; has_prev }
```

## Auth

### Tokens

`src/lib/auth/auth.ts` is the only module that touches `localStorage` directly:

```
byc_access_token   ← getAccessToken / setTokens
byc_refresh_token  ← getRefreshToken / setTokens
```

All accessors are SSR-guarded with `typeof window`. **Don't read these keys from anywhere else** — go through these helpers.

### Auth state

There is one query for "who am I":

- `src/features/auth/hooks/useCurrentUser.ts` — `useQuery({ queryKey: ['auth', 'me'], enabled: hasToken })`. On 401 it calls `clearTokens()`. 5-minute `staleTime`, no retries, no refetch on focus/reconnect.
- `src/features/auth/hooks/useAuth.ts` — composes `useCurrentUser` and exposes:
  - `user`, `isAuthenticated`, `isLoading`
  - `loginMutation` (seeds the `['auth', 'me']` cache with the returned user so no extra round-trip is needed)
  - `registerMutation`
  - `logout()` — clears tokens, `queryClient.clear()`, hard-redirects to `/mentor`

### Login quirk

The backend uses FastAPI's `OAuth2PasswordRequestForm`. `login()` posts `application/x-www-form-urlencoded` with field name **`username`** (not `email`) and `password`. See `src/features/auth/api/auth.api.ts`.

### Auth gates

Two gate components wrap protected route trees from inside the layout:

- `MentorAuthGate` (`src/features/auth/components/MentorAuthGate.tsx`) wraps `/mentor/**`.
- `AdminAuthGate` (`src/features/admin/components/AdminAuthGate.tsx`) wraps `/admin/**`.

New protected pages should drop into the existing `mentor/` or `admin/` layout — don't introduce new gate logic.

## Data fetching (TanStack Query)

Setup is in `src/app/providers.tsx`:

```
staleTime: 60_000          // 1 min
gcTime:    600_000         // 10 min
retry: 1
refetchOnWindowFocus: false
```

ReactQueryDevtools mounts in development. There is no Server Components data layer — fetching happens inside Client Component features via these hooks.

### Patterns to follow

**Query** (paginated list with kept-previous data for smooth pagination — see `features/mentors/hooks/useMentors.ts`):

```ts
useQuery({
  queryKey: ['mentors', normalizedFilters, page],
  queryFn: () => getMentors(filters, page),
  placeholderData: keepPreviousData,
})
```

**Mutation with cache invalidation** (see `features/mentor-dashboard/hooks/useMentorProfile.ts`):

```ts
useMutation({
  mutationFn: (data) => updateMyMentorProfile(data),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: MENTOR_PROFILE_KEY }),
})
```

Use stable, well-named query-key constants (e.g. `MENTOR_PROFILE_KEY`) so mutations can invalidate them without typo risk.

## Forms

No form library. Components manage local `useState`, validate with hand-rolled helpers, and surface inline errors per field. The canonical example is `src/features/booking/lib/validation.ts`:

```ts
validateEmail   validatePhone   validateCardNumber (Luhn)
validateExpiry  validateCVC     validateBookingForm
formatCardNumber  formatExpiry  formatPhone
```

`validateBookingForm` returns `ValidationError[]` (`{ field, message }`) — the form maps `errors.find(e => e.field === 'email')` to the input's helper text.

For a new form, follow this pattern: a `validate*Form` function returning `ValidationError[]` and small `format*` helpers as needed. Don't reach for react-hook-form / zod for a single form.

## UI system

| Concern        | Location                                                  | Notes                                                     |
| -------------- | --------------------------------------------------------- | --------------------------------------------------------- |
| shadcn/ui      | `src/components/ui/`                                      | Style `base-nova`, base color `neutral`, icons `lucide`. Config in `components.json`. |
| Layout chrome  | `src/components/layout/`                                  | `Navbar`, `Footer`, `MentorNav` (sidebar + mobile header) |
| Shared blocks  | `src/components/common/`                                  | `SectionContainer`, `AnimatedSection`, `GetStartedSection`|
| Animations     | `framer-motion`                                           | Imported per-component; see `AnimatedSection`             |
| Toasts         | `sonner`                                                  | Single `<Toaster>` mounted in root layout                 |
| Theme          | `next-themes`                                             | Class strategy, `defaultTheme="light"`, `enableSystem`    |

Add a shadcn component with `npx shadcn@latest add <name>`.

## Design tokens

All design tokens live in `src/app/globals.css` — **there is no `tailwind.config.*`** (Tailwind v4 reads tokens from CSS). The file has three blocks:

- `@theme inline { … }` — the Material 3 color palette (`--color-primary`, `--color-secondary`, `--color-tertiary`, `--color-error`, `--color-surface`, `--color-background`, plus all `--color-on-*`, `--color-*-container`, `--color-*-fixed`, etc.), the radius scale (`--radius-sm` through `--radius-2xl` + `--radius-full`), and the font families (`--font-headline`, `--font-body`, `--font-label`).
- `:root { … }` — app-level layout vars (`--app-max-width: 80rem`, `--app-gutter: 1.5rem`), brand vars (`--brand-blue`, `--brand-blue-hover`, `--brand-blue-soft`, `--brand-blue-surface`), shadcn-aligned theme vars (`--background`, `--foreground`, `--card`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--ring`, `--radius`), and component radii (`--radius-control`, `--radius-card`, `--radius-panel`).
- `.dark { … }` — dark-mode inversion of the same theme vars.

Plus utility classes in `@layer components`: `.page-container`, `.page-title`, `.app-card`, `.app-panel`, `.app-control`, `.brand-gradient`, and the `.hero-flip-*` 3D flip rig.

Add new tokens here, not in a config file.

## External integrations

- **Calendly** — scheduling widget embedded in `features/booking/components/CalendlySection.tsx`; helper in `features/booking/hooks/useCalendlyWidget.ts`; types in `src/types/calendly.d.ts` and `features/booking/types/calendly.ts`.
- **Fonepay** — Nepalese QR payment provider. `features/booking/api/paymentApi.ts` fetches the QR; `features/booking/hooks/useFonepayWebSocket.ts` opens a WebSocket for live payment-status updates with exponential backoff (`RETRY_DELAYS = [1000, 2000, 4000, 8000, 16000]`, `MAX_RETRIES = 5`). UI in `BankSelector`, `QRDisplay`, `FonepayPaymentSection`, `PaymentStatusDisplay`.
- **Microsoft Clarity + Google Analytics** — script tags injected from `src/app/layout.tsx` with `strategy="afterInteractive"`. Clarity tag id `wrxgt2khmj`, GA id `G-CLZVN0BK1Q`.
- **Remote image hosts** — allow-listed in `next.config.ts`: `lh3.googleusercontent.com/aida-public/**`, `res.cloudinary.com`, `images.unsplash.com`. Add new hosts here before referencing them in `<Image>`.

## TypeScript posture

- `strict: true` and `noUncheckedIndexedAccess: true` (`tsconfig.json`). Indexing an array/object yields `T | undefined` — narrow before use.
- Path alias `@/*` → `src/*`. shadcn aliases in `components.json` mirror this (`@/components`, `@/components/ui`, `@/lib`, `@/lib/utils`, `@/hooks`).
- Module resolution `bundler`; target ES2017.

## Filter/search state

`src/features/filters/` exposes a small `FilterContext` used by the mentor discovery flow. It holds normalized filter values that feed `useMentors` query keys (so changing a filter changes the cache entry).

## What is intentionally NOT here

If you're looking for one of these, it doesn't exist (yet):

- **No test runner.** No Jest, no Vitest, no Playwright. Don't add `__tests__` directories without first agreeing on a runner.
- **No `proxy.ts` / `middleware.ts`.** Auth is enforced client-side via gate components inside layouts.
- **No `instrumentation.ts`.**
- **No Server Actions** are used (the API surface is the FastAPI backend via axios from Client Components).
- **No per-route `error.tsx` / `loading.tsx`** — only the root `not-found.tsx`. Add them per-segment if you need scoped error UI.
- **No global state library** (Redux/Zustand/Jotai). Component-local state + TanStack Query covers the current needs.
- **No form library** (react-hook-form/zod). See "Forms" above.
- **No `tailwind.config.*`.** Tailwind v4 reads tokens from `src/app/globals.css`.
