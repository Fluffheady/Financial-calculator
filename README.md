# Address-Specific Rent vs. Buy Calculator (Beyond NYT)

## Project Vision
A high-fidelity financial modeling tool that moves beyond generic calculators. This project leverages address-level data to help users make "Rent vs. Invest" decisions by accounting for the true opportunity cost of capital, localized tax structures (specifically New York State), and specific property data.

The goal is to determine the exact **Breakeven Year** where the net worth of a homeowner exceeds the net worth of a renter who invests their surplus cash into the market.

## Project Management Approach
This project is managed using a **Product Management (PM) Framework**. The development process prioritizes:
- **Logic-First Development:** Ensuring the financial math is accurate before building UI.
- **Scope Management:** Focusing on high-utility features that provide "Beyond NYT" value.
- **Roadmap Clarity:** Maintaining a strict versioning and feature prioritization list.

## Core Feature Set (MVP)
- **Address-Level Data:** Integration with property APIs to pull actual tax history and market estimates for specific addresses.
- **The "Opportunity Cost" Engine:** A dual-track simulator comparing:
    - **Scenario A (Homeowner):** Equity growth + appreciation minus PITI (Principal, Interest, Taxes, Insurance), maintenance, and closing costs.
    - **Scenario B (Renter/Investor):** Total net worth if the down payment and monthly "mortgage-rent difference" were invested in the market (S&P 500).
- **The Buffalo/NY Context:**
    - Support for NY-specific tax exemptions (e.g., STAR credit).
    - Adjusted maintenance schedules for older Northeast housing stock.
    - "Sweat Equity" toggles for DIY or family-assisted maintenance logic.

## Technical Stack
- **Frontend:** Next.js / React
- **Logic:** TypeScript
- **Visuals:** Chart.js or Recharts for breakeven visualization.
- **Data:** Google Places API (Autocomplete) + Property Data API (e.g., RentCast, ATTOM, or Estated).

## Current Roadmap

### Sprint 1: The Math Foundation (Current Focus)
- [ ] Define the "Truth Formula" for the breakeven calculation.
- [ ] Build logic to handle compound interest for the "Renter" scenario (investing the down payment).
- [ ] Implement NY property tax calculation logic (City vs. School taxes).

### Sprint 2: Data & Address Integration
- [ ] Connect address autocomplete via Google Places.
- [ ] Fetch real-time property tax and valuation data via API.
- [ ] Implement fallback "Manual Input" for missing API data.

### Sprint 3: The Investor Dashboard
- [ ] Create interactive charts showing Net Worth comparison over 30 years.
- [ ] Add "What-If" toggles for market returns (4% vs 7% vs 10%).
- [ ] Build a summary view for "Breakeven Year" and "Total Cost of Ownership."

---
*Managed by Jules (AI Developer) under the direction of the Product Lead.*
