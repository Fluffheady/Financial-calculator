# New York State Default Values for Rent vs. Buy Calculator

Based on initial research, these are the baseline fallback values to be used by the Math Modeler agents when API data or user input is absent.

## 1. Property Taxes (NY Specific)
- **Breakdown:** Approximately 62% of the local property tax levy goes to School Taxes, and the remaining 38% goes to City/County/Town taxes.
- **Total Average Tax Rate:** As a baseline, use 1.23% to 1.5% of the property's assessed value depending on the specific region.
- **STAR Exemption:** The Basic STAR exemption provides a $30,000 reduction in the assessed value used to calculate *school taxes* only (or provided as a direct credit check). Enhanced STAR is available for seniors ($88,500 reduction). For default math, apply a $30,000 deduction to the assessed value before calculating the school tax portion.

## 2. Maintenance Costs
- **Default:** 3% of the property value annually (accounting for older Northeast housing stock).
- **Sweat Equity Modifier:** Reduces the 3% rate by 0.25% per slider notch based on the user's DIY experience.
- **Floor:** Maintenance costs have a hard minimum floor of 1.5% to account for physical parts and materials.

## 3. Closing Costs
- **Buyer Closing Costs:** Default to 3.5% of the purchase price (Range is typically 2% - 5% in NY, accounting for mortgage recording tax, title insurance, and attorney fees).
- **Seller Closing Costs:** Default to 8% of the sale price (Range is typically 8% - 10% in NY, primarily covering the 5-6% broker commission plus NY State Transfer Tax of $2 per $500, and local transfer taxes/flip taxes).

## 4. Rent Defaults
- **Starting Rent:** $3,500/month (Aggregated NY baseline; note NYC averages are higher at ~$4,600).
- **Rent Appreciation:** Default to 3% annually.

## 5. Core Holdings (Investor Portfolio)
- **Ticker Input:** The system must allow the user to input any possible stock ticker listed on the NYSE or other major listings. No hardcoded default portfolio is enforced; it must dynamically fetch and weight based on the user's chosen ticker symbols.
