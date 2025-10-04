# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

24LINK is a Nuxt 4 e-commerce application for ordering products with delivery tracking. The app uses Supabase as a backend, Pinia for state management, Leaflet for maps, and TailwindCSS v4 for styling.

## Commands

### Development
```bash
npm run dev         # Start dev server on localhost:3000
npm install        # Install dependencies
npm run build      # Build for production
npm run preview    # Preview production build
```

### Code Quality
```bash
npm run lint       # Run ESLint (quiet mode)
npm run lint:fix   # Auto-fix ESLint issues
```

## Architecture

### Directory Structure
- `app/` - Main application code (Nuxt 4 uses `app/` instead of root-level directories)
  - `pages/` - Route pages (file-based routing)
  - `components/` - Vue components organized by domain (Order/, UI/, Product/)
  - `composables/` - Reusable composition functions
  - `stores/` - Pinia stores (cart, order, products)
  - `services/core/` - API client layer with axios interceptors
  - `interfaces/` - TypeScript type definitions
  - `utils/` - Utility functions
  - `constants/` - App-wide constants

### State Management (Pinia)

**Cart Store** ([app/stores/cart.ts](app/stores/cart.ts))
- Manages shopping cart with localStorage persistence
- Handles product quantities, totals, and shipping costs (fixed at 50)
- Key methods: `incrementQuantity`, `decrementQuantity`, `setQuantity`, `clearCart`
- Computed: `totalItems`, `cartItems`, `totalAmount`

**Products Store** ([app/stores/products.ts](app/stores/products.ts))
- Fetches products and categories from Supabase
- Handles category filtering and search
- Returns either grouped (all categories) or filtered (single category) data via `processedData`
- Uses `useSupabaseApi` composable for API calls

**Order Store** ([app/stores/order.ts](app/stores/order.ts))
- Manages order details: phone, address, payment method, delivery method
- `canPlaceOrder` computed validates all required fields are set
- Supports adding new addresses dynamically

### API Layer

**Supabase Integration** ([app/composables/useSupabaseApi.ts](app/composables/useSupabaseApi.ts))
- Primary API client using Nuxt's `useFetch` and `$fetch`
- Base URL: `https://db.el24.cc/rest/v1`
- Handles auth headers differently for server/client:
  - Server: Uses `NUXT_SUPABASE_AUTH_TOKEN`
  - Client: Uses `NUXT_SUPABASE_API_KEY`
- Methods: `fetch()` (SSR), `fetchLazy()`, `$fetch()` (client-only)

**Alternative API Client** ([app/services/core/api-client.ts](app/services/core/api-client.ts))
- Axios-based factory with interceptor pattern
- Supports preset configurations via `API_CONFIGURATIONS`
- Auto-applies content-type, auth, logging (dev only), and error handling interceptors
- Not currently used but available for non-Supabase APIs

### Key Composables

**useGeolocation** ([app/composables/useGeolocation.ts](app/composables/useGeolocation.ts))
- Manages browser geolocation API with permission checks
- Returns Leaflet LatLng objects
- Handles permission states: granted, prompt, denied
- Important: Must manually call `getUserLocation()` and `resetGeolocationState()`

**useMapLocation** ([app/composables/useMapLocation.ts](app/composables/useMapLocation.ts))
- Wraps useGeolocation for map integration
- Manages map center, user marker, and lifecycle
- Auto-requests location on mount, cleans up on unmount

**useProductCart** - Bridges products with cart store
**useProductQuantity** - Manages inline quantity editing
**useProductFiltering** - Handles product search/filter logic
**useVerification** - Phone validation for checkout

### Pages & Routes

- `/` (index.vue) - Product catalog with search, categories, and cart button
- `/verificacion` - Checkout: review order, add phone/address
- `/ubicacion` - Map view to select/confirm delivery location
- `/detalles-orden` - Final order confirmation page
- `/status-pedido` - Order status tracking (post-order)

### Environment Variables

Required in `.env`:
```
NUXT_SUPABASE_AUTH_TOKEN=<server-side token>
NUXT_SUPABASE_API_KEY=<public API key>
```

Accessed via `useRuntimeConfig()`:
- Private: `config.supabaseAuthToken`
- Public: `config.public.supabaseApiKey`

### Nuxt Configuration

**Key Modules** ([nuxt.config.ts](nuxt.config.ts)):
- `@nuxt/eslint` - Linting integration
- `@nuxt/image` - Image optimization (configured for https://db.el24.cc)
- `@nuxt/fonts` - Google Fonts (Fira Sans)
- `@pinia/nuxt` - State management
- `@nuxtjs/leaflet` - Map integration
- `nuxt-lucide-icons` - Icon library
- `nuxt-toast` - Toast notifications
- `@tailwindcss/vite` - TailwindCSS v4 (via Vite plugin)

### Component Patterns

**Order Components** - Handle order display and status tracking
**UI Components** - Reusable design system (buttons, inputs, selection controls)
**Product Components** - Product cards, lists, and cart interactions

All components follow Vue 3 Composition API with `<script setup>`.

### Working with Products

Products are fetched from Supabase endpoint `/productos?activo=eq.true&select=*`
Categories from `/categorias?activa=eq.true&select=id,nombre`

When filtering:
- "Todas" (id: 'all') shows products grouped by category
- Specific category shows flat filtered list
- Search query filters across all products

### Geolocation Flow

1. Check permission via Permissions API
2. If granted: directly get location
3. If prompt: request permission + get location
4. If denied: show error, block location-dependent features
5. Always cleanup on component unmount to prevent memory leaks

### Git Workflow

Main branch: `main`
Current branch: `terio`

Recent commits focus on:
- Geolocation permission handling
- Map bug fixes
- Order creation location assurance
- Order status display fixes
