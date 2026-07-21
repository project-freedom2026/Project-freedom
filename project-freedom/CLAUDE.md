# Claude Instructions

For guidance on working with this codebase, see [AGENTS.md](AGENTS.md) which contains comprehensive conventions, state management patterns, and development setup instructions.

## Quick start for Claude
- The app is a Next.js financial dashboard for tracking retirement/freedom progress
- Main state and composition lives in [app/page.tsx](app/page.tsx)
- Components are in [components/](components/), calculations/logic in [lib/](lib/)
- Always sanitize numeric inputs to prevent NaN/Infinity
- Preserve localStorage persistence when modifying state
- Run `npm run lint && npm run build` before committing changes
