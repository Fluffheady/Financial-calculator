import { RenterInputs, RenterYearlyData } from './types.js';

export function simulateRenterWealth(
    inputs: RenterInputs,
    years: number = 30
): RenterYearlyData[] {
    const data: RenterYearlyData[] = [];

    // We assume the monthly surplus is invested at the end of each month.
    const monthlySurplus = Math.max(0, inputs.homeownerPITIAndCosts - inputs.monthlyRent);
    const monthlyRate = inputs.blendedReturnRate / 12;

    let currentBalance = inputs.initialInvestment;
    let costBasis = inputs.initialInvestment;

    for (let year = 1; year <= years; year++) {
        const startingBalance = currentBalance;
        let investmentReturns = 0;
        let annualContribution = 0;

        // Simulate 12 months of compounding
        for (let month = 1; month <= 12; month++) {
            const monthlyReturn = currentBalance * monthlyRate;
            investmentReturns += monthlyReturn;

            // Add returns and then add the monthly surplus (contribution)
            currentBalance += monthlyReturn + monthlySurplus;
            annualContribution += monthlySurplus;
            costBasis += monthlySurplus;
        }

        const endingBalance = currentBalance;
        const unrealizedGains = endingBalance - costBasis;

        // Net worth after taxes assumes liquidating the entire portfolio
        // Only the gains are taxed
        const netWorthAfterTaxes = endingBalance - (unrealizedGains > 0 ? unrealizedGains * inputs.capitalGainsTaxRate : 0);

        data.push({
            year,
            startingBalance,
            annualContribution,
            investmentReturns,
            endingBalance,
            costBasis,
            unrealizedGains,
            netWorthAfterTaxes
        });
    }

    return data;
}
