import { InvestorData } from '../types';

export interface RenterYearlyStatus {
  annualRentPaid: number;
  portfolioValue: number;
  netWorth: number; // Portfolio Value - Capital Gains Tax (if liquidated)
}

/**
 * Calculates long-term capital gains tax.
 * Assuming a simplified model where the entire gain is taxed at liquidation.
 */
export function calculateCapitalGainsTax(currentValue: number, totalInvestedBasis: number, taxRate: number): number {
  const gains = Math.max(0, currentValue - totalInvestedBasis);
  return gains * taxRate;
}

/**
 * Generates the full 30-year Renter opportunity cost model.
 *
 * @param investorData The renter/market baseline inputs
 * @param initialDownPayment The lump sum invested in Year 0 (Opportunity Cost of buying)
 * @param yearlySurplusArray Array of length 30 containing the difference between Homeowner Costs (PITI + Maintenance) and Rent.
 *                           If surplus is positive, the renter invests it. If negative, they must pull from portfolio.
 */
export function generateRenterSchedule(
  investorData: InvestorData,
  initialDownPayment: number,
  yearlySurplusArray: number[]
): RenterYearlyStatus[] {
  const schedule: RenterYearlyStatus[] = [];

  let currentPortfolioValue = initialDownPayment;
  let totalInvestedBasis = initialDownPayment; // Tracks principal for capital gains calculations
  let currentMonthlyRent = investorData.rentStart;

  for (let year = 1; year <= 30; year++) {
    let annualRentPaid = 0;
    let annualSurplusInvested = yearlySurplusArray[year - 1] || 0;

    // Process 12 months of compounding and rent payments
    for (let month = 1; month <= 12; month++) {
      annualRentPaid += currentMonthlyRent;

      // Monthly compounding of the portfolio
      const monthlyReturn = investorData.marketReturnRate / 12;
      currentPortfolioValue *= (1 + monthlyReturn);

      // Add the monthly surplus (e.g. Homeowner monthly cost - Rent)
      const monthlySurplus = annualSurplusInvested / 12;
      currentPortfolioValue += monthlySurplus;

      // Only track positive additions as basis (simplified)
      if (monthlySurplus > 0) {
          totalInvestedBasis += monthlySurplus;
      }
    }

    // Capital gains applied if portfolio liquidated at end of this year
    const capitalGainsTax = calculateCapitalGainsTax(currentPortfolioValue, totalInvestedBasis, investorData.capitalGainsTaxRate);
    const netWorthIfLiquidated = currentPortfolioValue - capitalGainsTax;

    schedule.push({
      annualRentPaid,
      portfolioValue: currentPortfolioValue,
      netWorth: netWorthIfLiquidated
    });

    // Rent appreciates for the next year
    currentMonthlyRent *= (1 + investorData.rentAppreciation);
  }

  return schedule;
}
