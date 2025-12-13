# Repository Guidelines

## Project Structure & Module Organization
- `src/app`: Next.js App Router pages and API routes; each domain (e.g., `dashboard`, `ppid`, `kependudukan`) holds its own `page.tsx` and supporting components. `layout.tsx` wires global providers and SSO guard.
- `src/components`: Shared UI pieces (breadcrumbs, selects, `SsoGuard`) reused across routes.
- `src/config`: Runtime constants, Chakra theme, and token helpers; client-side values use the `NEXT_PUBLIC_` prefix.
- `src/libs`: Utilities (`utils`) and shared typings; alias `@/` maps to `src/` (see `tsconfig.json`).
- `public`: Static assets; `env.example` documents required environment variables for `.env.local`.

## Setup & Environment
- Use Node 18+ and Yarn 1 (per `packageManager`). Install deps with `yarn install`.
- Copy `env.example` to `.env.local` and fill endpoints/tokens; keep base paths without trailing slashes as noted in comments.
- Do not commit real secrets; client-visible values must be prefixed with `NEXT_PUBLIC_`.

## Build, Test, and Development Commands
- `yarn dev` — start the dev server (Turbopack) on http://localhost:3000.
- `yarn build` — production build of the Next.js app.
- `yarn start` — run the built app.
- `yarn lint` — ESLint with Next Core Web Vitals and TypeScript rules.

## Coding Style & Naming Conventions
- TypeScript is strict; `any` is not lint-blocked but keep usage rare and documented.
- Prefer functional components, PascalCase for React components/files, camelCase for variables/functions, and domain-based folders under `src/app`.
- Use Chakra UI theming from `src/config/theme` and shared providers in `src/app/providers.tsx`; extend rather than duplicating styles.
- Keep imports using the `@/` alias for internal modules; group third-party imports above local ones.

## Testing Guidelines
- No automated tests are present yet; add focused tests when changing logic-heavy utilities or API handlers.
- Suggested pattern: colocate `*.test.ts(x)` alongside the file or under `__tests__` within the same domain, using `next/jest` and `@testing-library/react`.
- At minimum, run `yarn lint` before pushing to catch common issues.

## Commit & Pull Request Guidelines
- Recent history uses short imperative messages (e.g., `update ppid`); keep messages concise, start with a verb, and include a scope when helpful (`ppid: refresh token handling`).
- For PRs, include: summary of changes, screenshots/GIFs for UI updates, steps to reproduce/test, and any env/config changes required.
- Ensure `yarn build` and `yarn lint` pass before requesting review; link related issues or tickets when available.

## Security & Configuration Tips
- API middleware (`src/middleware.ts`) restricts protected routes to in-app origins; when adding new API paths, update `PROTECTED_API_PATHS` if they require the same guard.
- Generate secrets with `openssl rand -hex 32` (see `AUTH_SECRET` note in `env.example`), and store credentials only in `.env.local` or platform secret stores.
