<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

---

## Where to look first

- **Architecture & code organization:** [`ARCHITECTURE.md`](./ARCHITECTURE.md).
- **Next.js 16 upgrade master:** `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`.
- **App Router API reference:** `node_modules/next/dist/docs/01-app/03-api-reference/`.

The repo is Next.js **16.2.4** + React **19.2.4** + Tailwind v4 + TypeScript 5 strict (`noUncheckedIndexedAccess` on).

---

## Next.js 16 rules

Each rule has a one-line rationale and a pointer back to the installed doc. When unsure, open the doc — it ships with `next`, so it's authoritative for this exact version.

### Request-time APIs are async (this is the #1 thing models get wrong)

- **`await cookies()`** before calling `.get()` / `.set()` / `.delete()`. Doc: `01-app/03-api-reference/04-functions/cookies.md`.
- **`await headers()`** before reading. Doc: `01-app/03-api-reference/04-functions/headers.md`.
- **`params` is a `Promise<T>` in `page.tsx` / `layout.tsx` / `route.ts` / `default.tsx`.** `await props.params` in Server Components, or `use(props.params)` in Client Components. Doc: `01-app/03-api-reference/03-file-conventions/page.md`.
- **`searchParams` is a `Promise<T>`.** Same handling as `params`.
- **`id` in `opengraph-image` / `twitter-image` / `icon` / `apple-icon` handlers is a Promise.** `await id`. Doc: `01-app/02-guides/upgrading/version-16.md` (search "image metadata id").
- **`id` in `sitemap.ts` `generateSitemaps` is a Promise.** Same fix.

### Caching: defaults flipped

- **`fetch()` does NOT cache by default.** Opt in explicitly with `{ cache: 'force-cache' }`, with `next: { revalidate: N }`, or by wrapping the function with `'use cache'`. Doc: `01-app/03-api-reference/04-functions/fetch.md`.
- **Route Handler `GET` does NOT cache by default** either. Opt in with `export const dynamic = 'force-static'`. Doc: `01-app/01-getting-started/15-route-handlers.md`.
- **`revalidateTag(tag)` now requires a second `cacheLife` profile argument:** `revalidateTag('posts', 'max')`. Doc: `01-app/02-guides/upgrading/version-16.md`.
- **`updateTag()` is new in v16.** Use inside Server Actions when the same request needs to read-its-own-writes (it expires + refreshes synchronously). Prefer over `revalidateTag` for form submissions that expect immediate UI updates.

### Cache Components (`use cache`) is the new caching model

- **Enable it explicitly:** `cacheComponents: true` in `next.config.ts`. Required to use `'use cache'`. Replaces the experimental `dynamicIO` flag.
- **`'use cache'` is stable** — annotate a function or component to prerender it with dynamic data. Doc: `01-app/03-api-reference/01-directives/use-cache.md`.
- **`cacheLife()` and `cacheTag()` are stable** — import from `next/cache`, no `unstable_` prefix. Built-in `cacheLife` profiles: `'hours'`, `'days'`, `'weeks'`, `'months'`, `'max'`, `'default'`.
- **Runtime APIs are forbidden inside a `use cache` scope.** No `cookies()`, `headers()`, or `searchParams` reads. Read them outside, pass the values in as arguments.
- **`React.cache()` scope is isolated from `use cache` scope.** Values memoized outside are *not* visible inside. Pass values as arguments, not via a shared `React.cache` wrapper.
- **`'use cache'` cannot be the body of a Route Handler.** Extract the cached work into a helper function and call it from the handler.

### PPR is gone — Cache Components replaced it

- `experimental_ppr` was removed. Use `cacheComponents: true` instead. PPR semantics are now part of the Cache Components model.

### `middleware.ts` → `proxy.ts`

- **The file convention is renamed.** Move `middleware.ts` to `proxy.ts` and rename the exported `middleware` function to `proxy`. Codemod: `npx @next/codemod@canary middleware-to-proxy .`. Doc: `01-app/03-api-reference/03-file-conventions/proxy.md`.
- **Node.js runtime only** in `proxy.ts`. There is no `edge` runtime option and no `runtime` config. If you need edge-style behavior, push it into route handlers.
- **Config flag renamed:** `skipMiddlewareUrlNormalize` → `skipProxyUrlNormalize` in `next.config.ts`.
- **Server Actions are reachable via direct POST**, so re-validate auth inside every `'use server'` function. Don't rely on `proxy.ts` (or any middleware) as the only gate.

### `next/image` defaults changed

- **`minimumCacheTTL`: 60s → 4 hours.** Override only if you have a reason.
- **`imageSizes` no longer includes `16`.** Add it back if you serve 16px raster images.
- **`qualities` defaults to `[75]`.** Configure more qualities if you use them.
- **Local IPs blocked by default.** Set `images.dangerouslyAllowLocalIP: true` only for private networks.
- **Redirect chains capped at 3.** Increase `images.maximumRedirects` if needed.
- **`images.domains` is deprecated** — use `images.remotePatterns` (already done in `next.config.ts`).
- **Local image URLs with query strings require `images.localPatterns.search`.**
- **`next/legacy/image` is removed.** Use `next/image` directly.

### Turbopack is default

- **`next dev` and `next build` use Turbopack** with no flag. Opt out with `--webpack` if you have a custom webpack config.
- **`experimental.turbopack` moved to top-level `turbopack`** in `next.config.ts`.
- **Sass `~` prefix is not supported.** Use `@import 'bootstrap/...'`, not `@import '~bootstrap/...'`.
- **`next dev` now writes to `.next/dev/`** (not `.next/`). Update tracing scripts accordingly.

### Parallel Routes

- **Every parallel slot now requires an explicit `default.js`.** Return `null` or call `notFound()` if there's nothing meaningful to render.

### Scroll behavior

- Next no longer overrides CSS `scroll-behavior`. The current `scroll-smooth` class on `<html>` (`src/app/layout.tsx`) is fine. If you specifically want Next's previous override behavior, add `data-scroll-behavior="smooth"` to `<html>`.

### Removed

- **`next lint`** — gone. Use ESLint or Biome CLI directly (this repo already uses `eslint` in `package.json`).
- **`serverRuntimeConfig` / `publicRuntimeConfig`** — gone. Use env vars; prefix client-accessible ones with `NEXT_PUBLIC_`.
- **AMP support** — gone. Drop `amp: true` and `useAmp()` if you see them.
- **`next/legacy/image`** — gone (see above).

### React 19 specifics that bite

- **`useActionState` replaces `useFormState`.** Same idea, exposes pending state and other extras.
- **`useFormStatus`** now exposes `data`, `method`, `action` (in addition to `pending`).
- **`use()` unwraps Promises.** In Client Components, `const params = use(props.params)` replaces the old sync access.
- **No `forwardRef` needed.** `ref` is a normal prop in React 19.
- **`<Context>` is its own provider.** `<MyContext value={…}>` works directly — no `.Provider`.

### Runtime requirements

- **Node 20.9+**, **TypeScript 5.1+**. Both are already satisfied by this repo's `package.json`.

---

## Project-specific rules

These conventions are not enforced by the toolchain — follow them anyway.

- **One axios client.** All HTTP goes through `src/lib/api/api-client.ts` (`apiClient`). Don't `import axios from 'axios'` directly in feature `api/` files — you'd skip the Bearer-token interceptor and bypass the configured `baseURL`.
- **One auth read path.** Read auth state through `useCurrentUser` or `useAuth` (`src/features/auth/hooks/`). Only `src/lib/auth/auth.ts` touches `localStorage` directly. Don't sprinkle `localStorage.getItem('byc_access_token')` around the codebase.
- **Login is form-encoded.** The backend uses `OAuth2PasswordRequestForm`. POST `application/x-www-form-urlencoded` with field name `username` (not `email`) — see `src/features/auth/api/auth.api.ts`. Don't change to JSON.
- **Protected routes drop into existing layouts.** New mentor pages go under `src/app/mentor/`; new admin pages under `src/app/admin/`. Don't add new gate components — `MentorAuthGate` and `AdminAuthGate` already exist.
- **Feature-first.** New product code lives in `src/features/<name>/{api,components,hooks,types,lib}`. `src/app/**/page.tsx` should stay thin: import a feature component and render it. See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the full layout.
- **Tokens belong in `globals.css`.** All design tokens live in `src/app/globals.css` under `@theme inline` / `:root` / `.dark`. There is no `tailwind.config.*` — adding one will conflict with Tailwind v4.
- **No form library.** For new forms, follow the hand-rolled pattern in `src/features/booking/lib/validation.ts` (`validate*Form` returning `ValidationError[]`, optional `format*` helpers). Don't pull in react-hook-form / zod for a single form.
- **Match Prettier.** No semicolons, single quotes, 2-space indent, 100-char width. `prettier-plugin-tailwindcss` orders class names — let it.
- **Mind `noUncheckedIndexedAccess`.** Array/object index access yields `T | undefined`. Narrow before use; do not add `!` non-null assertions to silence the checker.
- **No test runner is configured.** Don't add `__tests__/` directories, Jest/Vitest configs, or `npm test` scripts without first agreeing on a runner — CI has no step to run them.
- **Remote image hosts must be allow-listed** in `next.config.ts` (`images.remotePatterns`) before being used in `<Image src="…">`. Current allow-list: `lh3.googleusercontent.com/aida-public/**`, `res.cloudinary.com`, `images.unsplash.com`.
- **Single env var.** Only `NEXT_PUBLIC_API_URL` is required. Don't introduce secrets as `NEXT_PUBLIC_*` (they ship to the browser).
<!-- END:nextjs-agent-rules -->
