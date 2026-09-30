# Conversation Context

### Objectives
- Conduct a `/grill-me` interactive interview session to align on the project requirements, architecture, tech stack, and development flow based on the technical specification.
- Finalize the tech stack and implementation roadmap for the Vehicle Resale Value Calculator (India focus: cars & two-wheelers).
- **[NEW] CarWale Comprehensive Scraping**: Scrape real-time new car catalogue from `https://www.carwale.com/new-cars/` (makes, models, variants, ex-showroom pricing) and populate into the local SQLite database.
- **[NEW] Firecrawl Scraper for Car & Bike Data**: Use Firecrawl CLI (`https://docs.firecrawl.dev/sdks/cli`) to scrape and build comprehensive vehicle catalog data (cars and bikes) into the local SQLite database.
- **[NEW] Environment Placeholder**: Create `.env` and `.env.example` with `FIRECRAWL_API_KEY` placeholder for the user to configure their API key.

## Background & Assumptions
- Product: Vehicle Resale Value Calculator for Indian market (cars and bikes).
- Core goal: Calculate realistic used-vehicle resale/buying price ranges using historical ex-showroom/on-road prices, depreciation curve, mileage normalization, condition scoring, ownership, service history, accident history, consumables, and market adjustments.
- Existing workspace is initialized with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4.
- CarWale provides server-rendered `window.__INITIAL_STATE__` containing 36 makes, models, and variant listings with official ex-showroom prices.
- Gemini API provides structured JSON output for missing cars, enabling the database to grow autonomously through user queries.
- Firecrawl CLI (`firecrawl-cli`) provides modern web scraping with JavaScript execution, schema-guided structured JSON extraction, and rate limit / concurrency management.

## Decisions Made
- Context tracking enabled in `conversation-context.md`.
- Data architecture: Use SQLite (lightweight, zero-cloud dependency) with Drizzle ORM.
- Vehicle Data Sourcing: Seeded SQLite database of top Indian car and bike brands/models/variants/historical prices and state RTO tax slabs, behind an extensible `VehicleDataProvider` interface that can plug into live external APIs when keys/endpoints are supplied.
- Valuation Engine: Decoupled, isomorphic pure TypeScript engine in `src/lib/valuation/` (zero web dependencies, runs on both server and client for instant slider updates).
- UI/UX Flow: 4-step interactive wizard (Vehicle Selection -> Location -> Usage & Condition -> Consumables) with step progress, culminating in an interactive Valuation Results Dashboard with breakdown waterfall and live adjustment sliders.
- Development Flow: UI-Driven / Visual First. Build the multi-step UI wizard and results dashboard with interactive mock data first to perfect UX, design, and interactions, then wire in the SQLite database and valuation engine formulas.
- Design Aesthetics & Theme: Bold, premium 3D & glassmorphism aesthetic inspired by **UI-Vault** (rich dark/light themes, glowing borders, depth shadows) and **21st.dev** (animated badges, shimmer cards, bento grids, spring physics, glowing accents) with full light/dark mode switcher.
- UI Libraries & Tooling: **shadcn/ui** patterns & primitives, `lucide-react` for automotive/interface icons, `framer-motion` for fluid step transitions and animated numbers, `react-hook-form` + `zod` for type-safe form validation.
- Component Inspirations:
  - From **UI-Vault**: Premium palette (`#0b0b0e` dark / `#faf8f5` light), 3D tactile elevation, glowing focus states, crisp typography.
  - From **21st**: Shimmer card borders, animated progress indicator, interactive confidence gauge, smooth spring tab switches.
  - From **shadcn/ui**: Clean accessible primitives for sliders, badges, dialogs, cards, and buttons.
- Currency & Regional Formats: Native Indian number formatting (₹ Lakhs & Crores, `en-IN` numbering system).
- **CarWale Scraper**: Extract makes from `/new-cars/`, models from `/{make}-cars/`, and variants from `/{make}-cars/{model}/`, batch-inserting into SQLite `brands`, `models`, `variants`, `vehicle_prices`.
- **Gemini AI Search Fallback**: Dedicated endpoint `/api/vehicles/ai-lookup` that accepts vehicle name query, calls Gemini model with strict JSON schema, inserts new car into SQLite DB, and returns it to the client.
- **[NEW] Firecrawl CLI Integration**:
  - Install `firecrawl-cli` into devDependencies.
  - Provide `.env` and `.env.example` with `FIRECRAWL_API_KEY=fc-YOUR_FIRECRAWL_API_KEY_HERE`.
  - Implement programmatic Firecrawl wrapper in `src/lib/firecrawl/` with CLI status verification, structured extraction, and URL scraping.
  - Build `src/scripts/scrape-vehicles-firecrawl.ts` to crawl both cars (CarWale/CarDekho) and bikes (BikeWale/BikeDekho), inserting into SQLite `brands`, `models`, `variants`, and `vehicle_prices`.
  - Expose API route `/api/vehicles/firecrawl-scrape` for on-demand crawling.

## Preferences / Working Style
- Interactive step-by-step interview (/grill-me) completed.
- UI-First delivery to validate interactions and aesthetics before wiring engine and database.

## Key Facts & Constraints
- Platform: Next.js 16.3.6 (App Router), React 19.2.8, Tailwind CSS v4.
- OS: macOS.
- Rule: AGENTS.md warns about Next.js 16 changes; ensure clean imports and compatibility.
- Decoupled valuation engine so calculations run isomorphically on both client and server.
- Support `FIRECRAWL_API_KEY` via `.env` / environment variables.
- Support `GEMINI_API_KEY` via `.env` / environment variables.

## Open Questions / Risks / Dependencies
- `FIRECRAWL_API_KEY` requires user key input in `.env` for live crawling against Firecrawl Cloud endpoints. Keyless rate limits are IP-restricted.

## Action Items & Next Steps
1. **Phase 1 (Setup & Foundation) - [COMPLETED]**
2. **Phase 2 (UI Wizard, Landing Page & Results Dashboard) - [COMPLETED]**
3. **Phase 3 (Isomorphic Valuation Engine) - [COMPLETED]**
4. **Phase 4 (SQLite Data Layer & API Provider) - [COMPLETED]**
5. **Phase 5 (Full Integration & Verification) - [COMPLETED]**
6. **Phase 6 (CarWale Scraper & Gemini AI Auto-Ingest) - [COMPLETED]**
7. **Phase 7 (Firecrawl CLI Integration for Cars & Bikes) - [COMPLETED]**:
   - [x] Created `.env` placeholder with `FIRECRAWL_API_KEY` and `.env.example`.
   - [x] Installed `firecrawl-cli` into devDependencies.
   - [x] Implemented Firecrawl CLI wrapper in `src/lib/firecrawl/index.ts` with CLI status check, structured extraction schema, and URL scraping.
   - [x] Built vehicle scraping engine `src/scripts/scrape-vehicles-firecrawl.ts` supporting cars and bikes with SQLite batch persistence.
   - [x] Ingested and expanded database: 49 bike models (up from 7), 320 car models, 1,670 variants, and 13,268 historical prices.
   - [x] Added npm scripts (`scrape:firecrawl`, `scrape:firecrawl:bikes`, `scrape:firecrawl:cars`).
   - [x] Created `/api/vehicles/firecrawl-scrape` route for on-demand crawling.
   - [x] Added automated unit tests (`src/lib/firecrawl/__tests__/firecrawl.test.ts`, 12/12 passing) and verified clean Next.js build.

## Chronological Summary
- **2026-09-27**: Context tracking established in `conversation-context.md`. Completed `/grill-me` session. Finalized tech stack.
- **2026-09-27**: Completed **Phase 1 (Setup & Foundation)** with UI Vault / 21st / shadcn design tokens, Outfit + Inter typography, Indian currency formatters, ThemeProvider, and core UI primitives.
- **2026-09-27**: Created root `IMPLEMENTATION_PLAN.md` to track detailed phase deliverables.
- **2026-09-27**: Completed **Phase 2 (UI Wizard, Landing Page & Results Dashboard)**.
- **2026-09-27**: Completed **Phase 3 (Isomorphic Valuation Engine)** with 10 passing unit tests.
- **2026-09-27**: Completed **Phase 4 (SQLite Data Layer & Extensible API Provider)**.
- **2026-09-28**: Completed **Phase 5 (Full Integration & Verification)**.
- **2026-09-28**: Completed **Phase 6 (CarWale Scraper & Gemini AI Auto-Ingestion)** per user request to scrape CarWale new cars into SQLite and provide Gemini AI fallback on search. Verified live scraping (324 models in DB) and Gemini AI ingestion.
- **2026-09-30**: Updated `.gitignore` with comprehensive rules to ignore SQLite databases & WAL journals (`*.db`, `*.db-wal`, `*.db-shm`), IDE directories (`.kilo/`, `.cursor/`, `.idea/`, `.vscode/`), OS metadata (`.DS_Store`), debug logs, and build artifacts, while preserving `data/.gitkeep`.
- **2026-09-30**: Completed **Phase 7 (Firecrawl CLI Integration)**. Created `.env` and `.env.example` with `FIRECRAWL_API_KEY` placeholder. Installed `firecrawl-cli`. Built Firecrawl wrapper and scraper for cars and bikes. Populated SQLite with 49 bike models, 320 car models, 1,670 variants, and 13,268 historical prices. Added unit tests and verified Next.js production build.



