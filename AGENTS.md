# AGENTS.md

Scope: applies to the entire repository rooted here.

## Project Summary

- App: **24 Horas de Fiesta**
- Stack: **Nuxt 4**, **Vue 3**, **TypeScript**, **Tailwind CSS v4**, **Pinia**
- Purpose: mobile-first delivery app for drinks/snacks in Morelia, Mexico

## Key Commands

```bash
npm run dev
npm run build
npm run generate
npm run preview
npm run lint
npm run lint:fix
```

## Repository Structure

- `app/components/` feature-based Vue components
- `app/composables/` shared Composition API logic
- `app/stores/` Pinia stores
- `app/services/` API and service layer
- `app/interfaces/` TypeScript interfaces
- `app/pages/` Nuxt file-based routes
- `app/constants/` shared constants

## Working Rules

- Keep changes **small, targeted, and consistent** with existing patterns.
- Prefer fixing the **root cause** instead of layering workarounds.
- Preserve the **mobile-first** approach in UI work.
- Reuse existing composables, stores, and shared UI components before adding new abstractions.
- Do not introduce large refactors unless the task explicitly requires them.
- Do not add new dependencies unless clearly necessary.

## Code Style

- Use TypeScript-first patterns and keep typings explicit when useful.
- Follow existing Vue/Nuxt conventions already present in the touched area.
- Prefer Composition API patterns consistent with current code.
- Avoid one-letter variable names.
- Avoid inline comments unless they add real value or are requested.

## Validation

- Run `npm run lint` after code changes when practical.
- There is currently **no formal test framework** configured; avoid inventing one unless requested.
- If you change build-sensitive configuration, also consider `npm run build`.

## Environment Notes

Expected environment variables include:

- `NUXT_SUPABASE_API_KEY`
- `NUXT_SUPABASE_AUTH_TOKEN`
- `NUXT_PUBLIC_MAPBOX_TOKEN`
- `NUXT_PUBLIC_DELIVERY_BASE_COST`
- `NUXT_PUBLIC_DELIVERY_COST_PER_KM`
- `NUXT_PUBLIC_DELIVERY_COST_PER_MINUTE`

## Domain Notes

- Delivery logic and location behavior are central to the app.
- Store coordinates and geographic assumptions are tied to **Morelia, Mexico**.
- Be careful with changes affecting checkout, address selection, map behavior, or order pricing.
