# Jules Agent Roles for Rent vs. Buy Calculator

This document outlines the roles and responsibilities for the Jules agents working on the Rent vs. Buy Calculator project.

## Agent 1: API & Data Integration Engineer
**Focus:** Connecting the application to external data sources.
- **Responsibilities:**
  - Research and integrate real-time property APIs (e.g., RentCast, ATTOM, Estated) to fetch property tax history, assessed value, and market estimates for specific addresses.
  - Implement integration with the Google Places API for address autocomplete.
  - Build the logic to fetch live stock ticker data (e.g., via Alpha Vantage, Yahoo Finance API, or Finnhub) for a user's customized "core holdings" portfolio.
  - Create robust error handling and fallback mechanisms (e.g., manual input mode) when API data is unavailable.

## Agent 2: UI/UX Component Developer
**Focus:** Building the interactive frontend components in Next.js/React.
- **Responsibilities:**
  - Develop all user input controls, specifically the granular sliders requested by the Product Manager (e.g., down payment, expected market return, maintenance cost, property appreciation, rent growth).
  - Build the "Core Holdings" input component, allowing users to enter custom stock tickers and percentage allocations.
  - Ensure the UI is responsive, accessible, and accurately reflects the NYT calculator's level of detail but with specific address context.
  - Connect the frontend sliders directly to the TypeScript math engine to update calculations in real-time.

## Agent 3: Data Visualization Specialist
**Focus:** Charting and visualizing the financial outcomes.
- **Responsibilities:**
  - Implement charting libraries (e.g., Chart.js or Recharts) to visualize the 30-year net worth comparison between renting and buying.
  - Create clear visual indicators for the "Breakeven Year".
  - Build the "Investor Dashboard" summary view, highlighting key metrics like Total Cost of Ownership and Opportunity Cost.
  - Ensure charts update smoothly and clearly when users adjust the UI sliders.

## Agent 4: Financial Math Modeler (Homeowner & NY Taxes)
**Focus:** The core logic for the "Buy" scenario.
- **Responsibilities:**
  - Implement the exact amortization schedule math.
  - Build the logic for calculating NY-specific property taxes (City vs. School) and applying the STAR exemption.
  - Create the algorithm to factor in older Northeast housing stock maintenance costs, and build the "Sweat Equity" modifier logic.
  - Calculate total homeowner sunk costs and equity buildup over time.

## Agent 5: Financial Math Modeler (Renter & Core Holdings)
**Focus:** The core logic for the "Rent" scenario and opportunity cost.
- **Responsibilities:**
  - Build the compound interest engine that tracks the renter's growing portfolio based on their initial down payment and monthly surplus (Homeowner PITI - Rent).
  - Integrate the logic that calculates the blended return rate based on the custom "Core Holdings" portfolio (Agent 1 fetches the data, Agent 5 applies it to the math).
  - Implement capital gains tax logic for the investor portfolio.
  - Compare the final Renter Net Worth against the Homeowner Net Worth year-over-year to pinpoint the exact breakeven point.

## Delegation and Task Management Protocol
As Lead Developer, I (Jules) will coordinate the activities of these 5 sub-agents without requiring manual intervention from the Project Manager.

**Workflow:**
1. I will decompose features from the Roadmap into specific technical tasks.
2. I will place these tasks into the `TASKS.md` file, tagging the specific agent required.
3. The agents will poll `TASKS.md` for their assignments.
4. When a task is complete, the agent will move it to the "Done" column in `TASKS.md` and submit a Pull Request.
5. I will review the agent's PR, run tests, and merge if it meets requirements.
