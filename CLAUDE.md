# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**"24 Horas de Fiesta"** is a Nuxt 3-based Progressive Web App for a 24/7 alcohol and snacks delivery service in Morelia, Mexico. The application enables users to browse products, place orders, track deliveries, and manage their account through a mobile-first interface.

## Technology Stack

- **Nuxt 3** (v4.1.2) with TypeScript
- **Vue 3** with Composition API
- **Tailwind CSS v4** for styling
- **Pinia** for state management
- **Supabase** for backend (via custom API client)
- **Mapbox GL JS** + **Leaflet** for maps
- **Vue Sonner** for notifications

## Development Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm run generate     # Generate static site
npm run preview      # Preview production build
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
```

## Architecture

### Directory Structure
- `/app/components/` - Vue components organized by feature (Category, Location, Order, Product, UI, Verification)
- `/app/composables/` - Reusable Vue composables for shared logic
- `/app/stores/` - Pinia stores (products, cart, order)
- `/app/services/` - API client and core services
- `/app/interfaces/` - TypeScript interfaces
- `/app/pages/` - File-based routing pages
- `/app/constants/` - App constants (store coordinates)

### Key Architectural Patterns

1. **State Management**: Pinia stores handle products, cart, and order state
2. **API Layer**: Custom API client factory in `/services/core/` with Axios-based HTTP client
3. **Composables**: Reusable logic for auth (`useAuth`), geolocation (`useGeolocation`), delivery calculations (`useDeliveryCalculator`)
4. **Component Organization**: Feature-based components with shared UI components in `/UI` folder

### Core Services
- **Authentication**: Phone-based verification with session management
- **Location Services**: Mapbox integration with geolocation and delivery area validation
- **E-commerce**: Product catalog, cart management, order placement and tracking
- **Delivery Calculation**: Distance and time-based pricing using store coordinates

## Configuration

### Environment Variables Required
```
NUXT_SUPABASE_API_KEY=        # Supabase anonymous key
NUXT_SUPABASE_AUTH_TOKEN=     # Supabase service role key
NUXT_PUBLIC_MAPBOX_TOKEN=     # Mapbox access token
NUXT_PUBLIC_DELIVERY_BASE_COST=30
NUXT_PUBLIC_DELIVERY_COST_PER_KM=7
NUXT_PUBLIC_DELIVERY_COST_PER_MINUTE=1.5
```

### Database
Uses Supabase with tables: `categorias`, `productos`, `pedidos`, `direcciones`, `usuarios` (see `estructura_supa.json`)

## Development Notes

- **No testing framework** currently configured
- **ESLint** configured with Nuxt preset for linting
- **Leaflet markers** excluded from build bundle (configured in nuxt.config.ts)
- **Mobile-first** responsive design approach
- **File-based routing** with Nuxt pages
- **Auto-imports** enabled for composables and components
- Store location coordinates hardcoded in `/constants/` (Morelia, Mexico)

## Key Store Coordinates
The delivery service is based in Morelia, Mexico with store coordinates defined in `/app/constants/index.ts`
