import { RenterYearlyData, HomeownerYearlyData, SimulationOutput } from './types.js';

export function findBreakevenPoint(
    renterData: RenterYearlyData[],
    homeownerData: HomeownerYearlyData[]
): SimulationOutput {
    let breakevenYear: number | null = null;
    let breakevenMonth: number | null = null;

    const maxYears = Math.min(renterData.length, homeownerData.length);

    for (let i = 0; i < maxYears; i++) {
        const rData = renterData[i];
        const hData = homeownerData[i];

        if (!rData || !hData) continue;

        // If Homeowner net worth is greater than or equal to Renter net worth
        if (hData.netWorth >= rData.netWorthAfterTaxes) {
            breakevenYear = hData.year;

            // Basic linear interpolation to find the approximate month
            // This assumes net worth grows somewhat linearly over the year
            if (i > 0) {
                const prevRData = renterData[i - 1]!;
                const prevHData = homeownerData[i - 1]!;

                const homeownerDiff = hData.netWorth - prevHData.netWorth;
                const renterDiff = rData.netWorthAfterTaxes - prevRData.netWorthAfterTaxes;

                const diffAtStartOfYear = prevRData.netWorthAfterTaxes - prevHData.netWorth;
                const catchingUpRatePerYear = homeownerDiff - renterDiff;

                if (catchingUpRatePerYear > 0) {
                    const fractionOfYear = diffAtStartOfYear / catchingUpRatePerYear;
                    breakevenMonth = Math.max(1, Math.min(12, Math.ceil(fractionOfYear * 12)));
                } else {
                    breakevenMonth = 1;
                }
            } else {
                // Breakeven happened in year 1
                breakevenMonth = 1;
            }

            break;
        }
    }

    return {
        renterData,
        breakevenYear,
        breakevenMonth
    };
}
