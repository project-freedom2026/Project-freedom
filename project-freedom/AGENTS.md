<!-- BEGIN:project-freedom-agent-rules -->
# Project Freedom agent guide

This repository is a small Next.js app for a personal finance dashboard. The main experience is a single-page calculator in [app/page.tsx](app/page.tsx) with persistent state stored in browser local storage.

## What to know
- Keep changes small and focused. The app is intentionally simple, so prefer straightforward updates over architectural rewrites.
- The main dashboard composition lives in [app/page.tsx](app/page.tsx). Reuse existing components from [components/](components/) before introducing new patterns.
- Calculation and estimation logic should live in [lib/](lib/) rather than inside React components. The retirement estimate logic is currently in [lib/estimateFreedomDate.ts](lib/estimateFreedomDate.ts).
- Styling uses Tailwind classes and the existing dark, dashboard-style UI. Match that visual tone and spacing when editing components.

## Working conventions
- Keep TypeScript types explicit and avoid adding dependencies unless they are clearly justified.
- Preserve the existing localStorage-backed persistence behavior when changing financial inputs or the dashboard state.
- For new UI features, prefer adding a small reusable component in [components/](components/) and wiring it from [app/page.tsx](app/page.tsx).
- Avoid editing generated or build output directories such as [.next/](.next/).

## Verification
Run these commands from the project root when changing app behavior or adding new logic:
- npm run lint
- npm run build

## Useful references
- [README.md](README.md) for setup and project context
- [app/page.tsx](app/page.tsx) for the primary user flow
- [components/](components/) for presentational building blocks
- [lib/](lib/) for calculations and helper logic
<!-- END:project-freedom-agent-rules -->
