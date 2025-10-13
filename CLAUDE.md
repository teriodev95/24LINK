# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Common Development Tasks
```bash
npm run dev         # Start development server
npm run build       # Production build
npm run generate    # Static site generation
npm run preview     # Preview production build
npm run lint        # Run ESLint
npm run lint:fix    # Fix linting issues
```

### Environment Setup
Copy `.env.example` to `.env` and configure required variables:
- `NUXT_SUPABASE_API_KEY` and `NUXT_SUPABASE_AUTH_TOKEN` for database access
- `NUXT_PUBLIC_MAPBOX_TOKEN` for maps functionality
- Delivery pricing variables for cost calculations

## Architecture Overview

This is a **24-hour delivery service frontend** ("24Link") built with **Nuxt 3** and **TypeScript**.

### Key Technologies
- **Framework**: Nuxt 3 with Vue 3 Composition API
- **Styling**: Tailwind CSS v4.x with custom design system
- **Database**: Supabase (PostgreSQL) with comprehensive schema
- **Maps**: Mapbox GL JS and Leaflet integration
- **State**: Pinia stores for cart, orders, and products
- **PWA**: Progressive Web App with offline capabilities

### Directory Structure
```
app/
├── components/       # Feature-organized Vue components
│   ├── Category/    # Product categorization
│   ├── Location/    # Maps and geolocation
│   ├── Order/       # Order management UI
│   ├── Product/     # Product display and cart
│   ├── UI/          # Reusable interface components
│   └── Verification/ # User authentication flows
├── composables/     # Business logic and API calls
├── stores/          # Pinia state management
├── pages/           # File-based routing
├── services/        # API service layer
├── interfaces/      # TypeScript type definitions
└── utils/           # Utility functions
```

### State Management Pattern
**Core Pinia Stores:**
- `cart.ts` - Shopping cart state and operations
- `order.ts` - Order lifecycle management
- `products.ts` - Product catalog and categories

### API Integration Pattern
**Key Composables:**
- `useOrderApi.ts` - Order CRUD operations
- `useAddressesApi.ts` - Address management
- `useVerificationApi.ts` - SMS/phone verification
- `useSupabaseApi.ts` - Base database operations
- `useDeliveryCalculator.ts` - Real-time delivery pricing

### Database Schema
The Supabase database includes tables for categories, products, orders, addresses, and user verification. Reference `estructura_supa.json` for complete schema details.

### Performance Considerations
- Build output is minified with compression enabled
- Images are optimized to WebP format
- Google Fonts are preloaded with fallbacks
- Bundle analysis is available via build process

## Development Patterns

### Component Organization
Components are grouped by feature domain rather than type. Each feature folder contains related components, composables, and types.

### TypeScript Usage
All components and composables use strict TypeScript. Interface definitions are in `/interfaces/` with global types in `/types/`.

### API Error Handling
API calls use standardized error handling through composables. Check existing patterns in `useSupabaseApi.ts` before creating new API integrations.

### Delivery Calculation
Delivery costs are calculated using geolocation distance and time estimates. The system supports both immediate and scheduled deliveries with dynamic pricing.