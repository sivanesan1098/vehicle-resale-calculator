# ResaleMeter India — Master Implementation Plan & Progress Tracker

> **Product:** Indian Used Car & Bike Resale Value Calculator  
> **Tech Stack:** Next.js 16 (App Router) • React 19 • TypeScript • Tailwind CSS v4 • Framer Motion • Lucide Icons • SQLite + Drizzle ORM • Decoupled Pure TS Valuation Engine  
> **Aesthetic Guidance:** Inspired by **UI-Vault** (tactile 3D elevation, `#0b0b0e` dark / `#faf8f5` light palette), **21st.dev** (shimmer borders, spring micro-interactions, speedometer confidence gauge), and **shadcn/ui** accessible primitives.

---

## 📌 Implementation Status Overview

| Phase | Description | Status | Progress |
|---|---|:---:|:---:|
| **Phase 1** | Project Setup, Design System, Theme & UI Primitives | **COMPLETED** | 100% |
| **Phase 2** | Interactive 4-Step Wizard & Valuation Results Dashboard (Visual First) | **COMPLETED** | 100% |
| **Phase 3** | Decoupled Isomorphic Pure TypeScript Valuation Engine | **COMPLETED** | 100% |
| **Phase 4** | SQLite Schema, Seed Data (Indian Cars/Bikes/RTO), & API Provider Adapter | **COMPLETED** | 100% |
| **Phase 5** | End-to-End Integration, Live Data Wiring & UX Polish | **COMPLETED** | 100% |
| **Phase 6** | CarWale Web Scraper & Gemini AI Auto-Ingestion Fallback | **COMPLETED** | 100% |

---

## 🏗️ Detailed Phase Breakdown

### Phase 1: Setup & Design Foundation `[COMPLETED]`
- [x] Install runtime dependencies
- [x] Configure Design System Tokens (`src/app/globals.css`)
- [x] Setup Typography (`Outfit` display font for cockpit gauges & prices; `Inter` for body) in `src/app/layout.tsx`
- [x] Implement Theme Provider & Animated Toggle (`ThemeProvider`, `ThemeToggle`)
- [x] Create Indian Currency & Utility Formatters (`formatINR`, `formatLakhs`, `formatCrores`, `formatKm`)
- [x] Implement Core UI Primitives (`Button`, `Card`, `Badge`, `Slider`, `ConfidenceGauge`, `WizardStepper`, `Navbar`)
- [x] Build verification: `next build` executed with Exit Code 0 and zero warnings.

---

### Phase 2: UI Wizard & Valuation Dashboard (Visual First) `[COMPLETED]`
- [x] **Overloaded Cinematic Landing Page (`src/components/landing/landing-page.tsx`)**:
  - Live continuous marquee ticker of real-time used vehicle valuations across Indian cities.
  - Cinematic hero showcase with generated photorealistic Indian automotive asset (`/images/hero-showcase.jpg`) and floating telemetry cards.
  - Live interactive age retention simulator with real-time slider and car/bike toggle.
  - Bento Grid of automotive intelligence (historical price anchoring, RTO isolation, cockpit telemetry, 4-tier pricing perspective).
  - Head-to-head comparison table: Generic Auto Portals vs. ResaleMeter India.
- [x] **Step 1 Component — Vehicle Selector (`src/components/wizard/step-vehicle.tsx`)**:
  - Car 🚗 vs Bike 🏍️ category switch.
  - **Fast vehicle search & filter bar** across brand, model, and variants with instant autocomplete.
  - Model year selector (2017 to 2024) and historical ex-showroom price anchoring callout.
- [x] **Step 2 Component — Location & RTO Selector (`src/components/wizard/step-location.tsx`)**:
  - State selector with Indian states (TS, KA, MH, DL, TN, KL, GJ) and RTO code picker.
  - On-road cost reconstruction card isolating metal cost from state road taxes and fees.
- [x] **Step 3 Component — Vehicle Usage & Condition (`src/components/wizard/step-usage.tsx`)**:
  - Interactive Odometer slider with quick presets.
  - Registered owner count (1st to 4th+ Owner).
  - Overall condition tactile cards with multipliers.
  - Service history selector and accident history radio chips.
- [x] **Step 4 Component — Consumables & Documentation (`src/components/wizard/step-consumables.tsx`)**:
  - Explicit tyre replacement deduction cards (-₹16,000 for car, -₹4,500 for bike).
  - Battery condition (-₹5,000 car, -₹1,800 bike) and insurance status.
- [x] **Interactive Valuation Results Dashboard (`src/components/dashboard/valuation-dashboard.tsx`)**:
  - Hero Fair Market Value card with glowing emerald/orange accents.
  - Speedometer radial confidence meter with factors & caveats.
  - 4-Way Transaction Pricing Matrix (Fair Market, Likely Selling, Recommended Seller Listing, Dealer Trade-In).
  - Value drivers and transparent mathematical waterfall breakdown.
  - Live scenario tweak sliders for real-time recalculations.
  - **1-Click WhatsApp Share**: Pre-formatted rich message for sharing appraisals directly with buyers or sellers on WhatsApp.
  - **OLX / Dealer Negotiation Copy**: Dedicated share modal with clipboard copy formatted for portal listings and trade negotiations.
  - **Formatted Printable PDF Certificate (`@media print`)**: Clean legal-style valuation appraisal certificate.
- [x] **Main Page Assembly (`src/app/page.tsx`)**:
  - Integrated Navbar, hero header, WizardStepper, AnimatePresence step transitions, and full results dashboard
- [x] **Build & Runtime Verification**:
  - `npm run build` passed with Exit Code 0 in 1.0s
  - Local dev server active and responding with HTTP 200 on `http://localhost:3001`

---

### Phase 3: Decoupled Isomorphic Pure TypeScript Valuation Engine `[COMPLETED]`
- [x] **Domain Types & Models (`src/lib/valuation/types.ts`)**:
  - `ValuationInput`, `ValuationBreakdown`, `PriceRanges`, `ConfidenceAssessment`, `ValuationResult`
- [x] **Modular Calculation Components (`src/lib/valuation/`)**:
  - `depreciation.ts` (Non-linear age retention curves for cars and bikes with 15% scrap floor)
  - `mileage.ts` (Relative usage normalization against Indian annual benchmarks: 11k km/yr car, 7k km/yr bike)
  - `condition.ts` (Condition multipliers: Excellent +5%, Very Good +2%, Good 0%, Fair -6%, Needs Work -16%)
  - `ownership.ts` (1st owner premium vs 2nd -3.5%, 3rd -7.5%, 4th+ -12%)
  - `service.ts` (Authorized OEM +3.0%, Partial 0%, None -4.5%)
  - `accident.ts` (Minor cosmetic -₹8k, major mechanical -₹35k, structural/flood -₹95k)
  - `consumables.ts` (Explicit deductions for worn tyres -₹16k, weak battery -₹5k, expired insurance -₹12k)
  - `market.ts` (Synthesis: 40% intrinsic + 60% market evidence, 4-tier transaction matrix, confidence scoring)
  - `calculator.ts` (Master orchestrator `calculateValuation()` function)
  - `index.ts` (Clean barrel export)
- [x] **Wired into UI Results Dashboard (`valuation-dashboard.tsx`)**:
  - Live isomorphic calculation dynamically re-executing pure engine formulas on slider changes.
- [x] **Automated Unit Test Suite (`src/lib/valuation/__tests__/valuation.test.ts`)**:
  - 10 automated unit tests covering depreciation, mileage normalization, consumables deductions, 2022 Hyundai i20 benchmark, 2021 Royal Enfield Classic 350 benchmark, and structural damage edge cases.
  - Configured `npm test` script in `package.json` using `tsx --test`. All 10 tests passing in ~95ms.

---

### Phase 4: SQLite Database & Extensible API Provider `[COMPLETED]`
- [x] **Drizzle ORM Schema (`src/lib/db/schema.ts`)**:
  - Tables: `brands`, `models`, `variants`, `vehicle_prices`, `rto_rules`, `market_comparables`
- [x] **Database Client (`src/lib/db/index.ts`)**:
  - SQLite configuration using `better-sqlite3` and `drizzle-orm/better-sqlite3` with WAL mode and globalThis HMR singleton.
- [x] **Indian Vehicle Seed Data (`src/lib/db/seed.ts`)**:
  - Cars: Maruti (Swift, Baleno, Brezza), Hyundai (i20, Creta), Tata (Nexon, Punch), Mahindra (Thar, XUV700), Honda (City), Toyota
  - Bikes: Royal Enfield (Classic 350, Hunter 350), TVS (Apache RTR 160, Jupiter), Bajaj (Pulsar NS200), Honda (Activa 6G), Yamaha (R15)
  - Historical ex-showroom prices from 2017 to 2024
  - RTO road tax percentages for TS (14%), KA (18%), MH (13%), DL (10%), TN (15%), KL (15%), GJ (8%)
- [x] **`VehicleDataProvider` Interface & Extensible API Adapter (`src/lib/data-provider/index.ts`)**:
  - `SQLiteVehicleDataProvider` querying local SQLite tables.
  - `ExternalAPIVehicleDataProvider` ready for live third-party APIs (RapidAPI / VAHAN) with graceful SQLite fallback.
- [x] **Next.js REST API Route Handlers**:
  - `GET /api/vehicles/brands` (filters by category e.g. car vs bike)
  - `GET /api/vehicles/models?brandId=hyundai`
  - `GET /api/vehicles/variants?modelId=hyundai-i20`
  - `GET /api/vehicles/price?variantId=i20-sportz-petrol-mt&year=2022`
  - `GET /api/rto?stateCode=TS`
  - `POST /api/valuation` (Zod-validated endpoint invoking the valuation engine)
- [x] **API Route Verification**:
  - Tested all endpoints with `curl` against local dev server — all returning HTTP 200 with structured JSON responses.

---

### Phase 5: End-to-End Integration & Polish `[COMPLETED]`
- [x] **Client Data Service with Memory Caching (`src/lib/data-service.ts`)**:
  - Implemented async fetching with automatic offline fallback to built-in datasets if API is unreachable.
- [x] **Wired Multi-Step Wizard to Live API / SQLite Database**:
  - `step-vehicle.tsx`: Dynamic brand, model, variant, and ex-showroom price fetching from `/api/vehicles/*`.
  - `step-location.tsx`: Dynamic RTO rules, registration charges, and on-road metal cost isolation from `/api/rto`.
- [x] **Responsive Layout & Visual Excellence**:
  - Mobile & desktop optimized layout with collapsible telemetry, bottom-docked action bars, and glassmorphism styling.
- [x] **Printable Appraisal Certificate (`@media print`)**:
  - Clean monochrome/accented legal report layout omitting interactive buttons and rendering formal vehicle appraisal documents.
- [x] **Production Build & Test Suite Verification**:
  - `npm test`: 10/10 tests passing in ~95ms.
  - `npm run build`: Exit Code 0, all 10 static/dynamic routes successfully compiled.

---

### Phase 6: CarWale Web Scraper & Gemini AI Auto-Ingestion `[COMPLETED]`
- [x] **CarWale Scraper Module (`src/scripts/scrape-carwale.ts`)**:
  - Scraped makes list from `https://www.carwale.com/new-cars/`
  - Scraped 312+ models and prices across top 20 brands
  - Crawled detailed variants for high-volume models (Nexon, Punch, Harrier, Safari, Brezza, Baleno, Swift, Creta, Venue, i20, Seltos, Sonet, City, Elevate, Virtus, etc.)
  - Populated 1,500+ variants and 11,900+ historical ex-showroom prices into SQLite tables (`brands`, `models`, `variants`, `vehicle_prices`)
  - Added CLI runner `npm run scrape:carwale` in `package.json`
- [x] **Gemini AI Vehicle Sourcing Engine (`src/lib/gemini.ts`)**:
  - Google Gemini API integration using `@google/genai` (Gemini 2.5 Flash) with structured JSON prompt
  - Extraction of brand, model, variants, year, ex-showroom price, and segment
  - Automatic persistence into SQLite database upon discovery
  - Robust automotive heuristic fallback when API key is not present or offline
- [x] **AI Lookup API Endpoint (`/api/vehicles/ai-lookup`)**:
  - `POST` / `GET` route that accepts vehicle name or search query
  - Queries SQLite first; if missing, invokes Gemini AI, saves into DB, and returns structured data
- [x] **UI Integration in Wizard Search (`src/components/wizard/step-vehicle.tsx`)**:
  - Real-time search across all 324+ CarWale models
  - "✨ Gemini AI Auto-Fetch" action and 0-result fallback callout
  - Seamless auto-selection and database persistence of AI-fetched cars

---

## 📝 Change Log & Session Progress

| Date | Phase | Changes & Milestones |
|---|:---:|---|
| **2026-09-27** | Phase 1 | Completed `/grill-me` alignment session. Initialized `conversation-context.md`. Installed `lucide-react`, `framer-motion`, `react-hook-form`, `zod`, `@hookform/resolvers`, `clsx`, `tailwind-merge`. Configured UI-Vault / 21st design system tokens in `globals.css`. Implemented `ThemeProvider`, `ThemeToggle`, `utils.ts` (INR currency formatting), `Button`, `Card`, `Badge`, `Slider`, `ConfidenceGauge`, `WizardStepper`, `Navbar`. Build verified with zero warnings. |
| **2026-09-27** | Phase 1 | Created `IMPLEMENTATION_PLAN.md` to track full architectural roadmap and milestones. |
| **2026-09-27** | Phase 2 | Completed **Phase 2 (UI Wizard & Valuation Dashboard - Visual First)**: Created `mock-data.ts`, `step-vehicle.tsx`, `step-location.tsx`, `step-usage.tsx`, `step-consumables.tsx`, and `valuation-dashboard.tsx`. Assembled in `page.tsx` with fluid step transitions and live slider updates. `npm run build` passed in 1.8s. Dev server verified active at `http://localhost:3001` (HTTP 200). |
| **2026-09-27** | Phase 3 | Completed **Phase 3 (Decoupled Valuation Engine)**: Built pure TypeScript domain calculation modules (`depreciation.ts`, `mileage.ts`, `condition.ts`, `ownership.ts`, `service.ts`, `accident.ts`, `consumables.ts`, `market.ts`, `calculator.ts`). Added 10 automated unit tests (`valuation.test.ts`) executed with `tsx --test`. All passing in ~95ms. |
| **2026-09-27** | Phase 4 | Completed **Phase 4 (SQLite Database & Extensible API Provider)**: Built Drizzle ORM schema, seeded Indian vehicles and RTO tax rates, built `SQLiteVehicleDataProvider` & `ExternalAPIVehicleDataProvider`, and created 6 REST API endpoints (`/api/vehicles/*`, `/api/rto`, `/api/valuation`). Verified via `curl`. |
| **2026-09-28** | Phase 5 | Completed **Phase 5 (End-to-End Integration & Polish)**: Built `data-service.ts` with client-side caching & fallback. Wired `step-vehicle.tsx` and `step-location.tsx` to live backend APIs. Validated mobile-first responsive layout, `@media print` certificate, 10/10 passing tests, and production build. |
| **2026-09-28** | Phase 6 | Completed **Phase 6 (CarWale Scraper & Gemini AI Auto-Ingestion)**: Scraped real-time new cars from CarWale into SQLite (324 models, 1500+ variants, 11900+ prices). Built `@google/genai` Gemini AI fallback engine and `/api/vehicles/ai-lookup` endpoint. Integrated live search and AI auto-fetch button into Step 1 vehicle selector. Verified end-to-end tests and build. |

