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

## State management & persistence
- Component state lives in [app/page.tsx](app/page.tsx) and is passed down via props to child components.
- Child components call callback functions to update parent state; they do not manage financial data themselves.
- All state is persisted to browser localStorage using `useState` factory functions for initialization:
  ```typescript
  const [data, setData] = useState<FinancialData>(() => {
    const saved = window.localStorage.getItem("key");
    return saved ? JSON.parse(saved) : defaultData;
  });
  ```
- Use `useEffect` with state dependency to persist changes back to localStorage after each update.
- Always check for `typeof window !== "undefined"` before accessing localStorage (SSR safety).

## Financial data patterns
- All numeric inputs are sanitized with `sanitizeFinancialValue()` to prevent NaN or Infinity propagation:
  - Checks if value is a finite number
  - Returns 0 for invalid inputs
  - Ensures values are >= 0
- Financial calculation functions (in [lib/](lib/)) return typed results (e.g., `FreedomEstimateResult`) with explicit status fields to avoid implicit assumptions.
- Use immutable updates: `setData((current) => ({ ...current, field: newValue }))` instead of mutations.
- Always validate localStorage data with try-catch; corrupt data should fall back to defaults without breaking the app.

## Development setup & verification
- **Start dev server**: `npm run dev` (runs on http://localhost:3000)
- **Build for production**: `npm run build`
- **Run production build locally**: `npm run start`
- **Lint code**: `npm run lint` (ESLint with Next.js TypeScript rules)
- Run these commands when changing app behavior, adding logic, or before submitting changes.

## Useful references
- [ROADMAP.md](ROADMAP.md) for product direction and principles
- [README.md](README.md) for setup and project context
- [app/page.tsx](app/page.tsx) for the primary user flow and state structure
- [components/](components/) for presentational building blocks
- [lib/](lib/) for calculations and helper logic
<!-- END:project-freedom-agent-rules -->
