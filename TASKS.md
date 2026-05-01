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
- [ ] Sprint 1: Build the Homeowner Math Engine (TypeScript)
  - Create the exact amortization schedule math function.
  - Implement logic for NY-specific property taxes (City vs. School) and STAR exemption (use DEFAULTS.md: 62% school tax, $30k deduction from assessed value for school tax).
  - Create the algorithm for maintenance costs: 3% default, sweat equity brings it down by .25% based on experience slider, but costs still max at 1.5% for parts.
  - Calculate total sunk costs vs. equity buildup over 30 years. Use DEFAULTS.md for Closing Costs (Buyer: 3.5%, Seller: 8%).

### Agent 5: Financial Math Modeler (Renter & Core Holdings)
- [ ] Sprint 1: Build the Renter Opportunity Cost Engine (TypeScript)
  - Build the compound interest engine to track the growing portfolio (Down payment + Monthly surplus).
  - Integrate logic for calculating a blended return rate from custom "Core Holdings". Ensure the system allows the user to input any possible stock ticker listed on the NYSE or other major listings.
  - Implement capital gains tax logic for the investor portfolio.
  - Compare Renter Net Worth vs. Homeowner Net Worth annually to identify the exact Breakeven Year.
  - Use DEFAULTS.md for baseline rent ($3,500) and rent appreciation (3%).

## IN PROGRESS
- [ ] None

## DONE
- [x] Defined initial agent roles and delegation system.
