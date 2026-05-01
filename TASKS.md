# Central Agent Task Queue

This file serves as the asynchronous task queue managed by the Lead Developer. Agents should read their respective sections to find their current priorities.

## TODO

### Agent 1: API & Data Integration Engineer
- [ ] Sprint 2: API Integration Research & Scaffolding
  - Research Property APIs (RentCast, ATTOM) for fetching NY property tax history and market estimates.
  - Setup stub functions to fetch live stock ticker data for user "Core Holdings".
  - Build mock data fallbacks for development.

### Agent 2: UI/UX Component Developer
- [ ] Sprint 3: UI Input Components (Sliders & Core Holdings)
  - Scaffold React/Next.js components for granular inputs (sliders for down payment, interest rate, maintenance, rent growth).
  - Create the UI for users to input custom stock tickers and percentage allocations for their portfolio.
  - Ensure sliders are bound to state for real-time math engine updates.

### Agent 3: Data Visualization Specialist
- [ ] Sprint 3: Charting & Breakeven Visualization
  - Scaffold Chart.js or Recharts implementation.
  - Build the foundation for the "Investor Dashboard" summary view (Total Cost of Ownership vs. Opportunity Cost).
  - Create mock charts using dummy Net Worth data arrays.

### Agent 4: Financial Math Modeler (Homeowner & NY Taxes)
- [ ] TBD (Sprint 1 Complete)

### Agent 5: Financial Math Modeler (Renter & Core Holdings)
- [ ] TBD (Sprint 1 Complete)

## IN PROGRESS
- [ ] None

## DONE
- [x] Agent 4: Built the Homeowner Math Engine (TypeScript) including amortization, NY taxes, maintenance sweat equity logic, and closing costs.
- [x] Agent 5: Built the Renter Opportunity Cost Engine (TypeScript) including compound interest, capital gains, and breakeven comparison.
- [x] Defined initial agent roles and delegation system.
