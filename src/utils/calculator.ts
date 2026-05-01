import { PropertyData, NYTaxData, InvestorData, YearlyNetWorth } from '../types';
import { generateHomeownerSchedule } from './homeowner';
import { generateRenterSchedule } from './renter';

export interface CalculatorResult {
  breakevenYear: number | null; // null if homeowner never overtakes renter
  yearlyData: YearlyNetWorth[];
}

/**
 * Orchestrates the Homeowner and Renter math engines to determine the exact Breakeven Year.
 */
export function calculateBreakeven(
  propertyData: PropertyData,
  taxData: NYTaxData,
  investorData: InvestorData,
  annualInsurance: number
): CalculatorResult {

  // 1. Generate Homeowner baseline schedule first to determine annual sunk costs
  const homeownerSchedule = generateHomeownerSchedule(propertyData, taxData, annualInsurance);

  // 2. Calculate the yearly surplus available to the Renter.
  // Surplus = Homeowner Total Sunk Costs + Principal Payments - Rent Paid
  // (We use a 2-pass approach for simplicity: estimate rent first to get the surplus)

  const yearlySurplusArray: number[] = [];
  let currentMonthlyRent = investorData.rentStart;

  for (let year = 1; year <= 30; year++) {
      const annualRent = currentMonthlyRent * 12;
      const homeownerCosts = homeownerSchedule[year - 1].annualSunkCosts;

      // Additional cash the homeowner put into principal that the renter can invest instead
      // Total monthly homeowner cash outflow = monthlyMortgage * 12 + annualTaxes + annualMaintenance + annualInsurance
      // For precision, we use the fact that the renter invests everything the homeowner spent on PITI + Maint - Rent
      // In homeownerSchedule, annualSunkCosts = Taxes + Maintenance + Interest + Insurance.
      // We need to add the principal paid to get total cash out.

      const previousPrincipal = year === 1 ? (propertyData.price * (1 - propertyData.downPaymentPercent)) : homeownerSchedule[year - 2].remainingPrincipal;
      const principalPaid = previousPrincipal - homeownerSchedule[year - 1].remainingPrincipal;

      const totalHomeownerCashOutflow = homeownerCosts + principalPaid;

      const annualSurplus = totalHomeownerCashOutflow - annualRent;
      yearlySurplusArray.push(annualSurplus);

      currentMonthlyRent *= (1 + investorData.rentAppreciation);
  }

  // 3. Generate Renter schedule using the calculated surplus
  // The renter gets to invest the down payment AND the buyer closing costs the homeowner paid on Day 1
  const initialDownPayment = propertyData.price * propertyData.downPaymentPercent;
  const buyerClosingCosts = propertyData.price * 0.035;
  const totalRenterInitialInvestment = initialDownPayment + buyerClosingCosts;

  const renterSchedule = generateRenterSchedule(investorData, totalRenterInitialInvestment, yearlySurplusArray);

  // 4. Compare Net Worths to find the Breakeven Year
  const yearlyData: YearlyNetWorth[] = [];
  let breakevenYear: number | null = null;

  for (let year = 1; year <= 30; year++) {
    const hwNetWorth = homeownerSchedule[year - 1].netWorth;
    const rentNetWorth = renterSchedule[year - 1].netWorth;
    const isBreakeven = hwNetWorth > rentNetWorth;

    if (isBreakeven && breakevenYear === null) {
        breakevenYear = year;
    }

    yearlyData.push({
      year,
      homeownerNetWorth: hwNetWorth,
      renterNetWorth: rentNetWorth,
      isBreakeven
    });
  }

  return {
    breakevenYear,
    yearlyData
  };
}
