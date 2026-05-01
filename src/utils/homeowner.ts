import { calculateAmortizationSchedule } from "./amortization";
import { calculateNYPropertyTaxes } from "./taxes";
import { calculateMaintenanceCost } from "./maintenance";

export interface HomeownerScenarioYear {
  year: number;
  propertyValue: number;
  remainingDebt: number;
  equity: number;
  totalSunkCosts: number;
}

export function simulateHomeownerScenario(
  homePrice: number,
  downPayment: number,
  loanInterestRate: number,
  loanYears: number,
  propertyTaxRates: { city: number; school: number },
  starExemption: number,
  homeAge: number,
  isDIY: boolean,
  annualInsurance: number,
  closingCosts: number,
  homeAppreciationRate: number,
  yearsToSimulate: number
): HomeownerScenarioYear[] {
  const scenario: HomeownerScenarioYear[] = [];
  const principal = homePrice - downPayment;
  const amortization = calculateAmortizationSchedule(
    principal,
    loanInterestRate,
    loanYears
  );

  let currentPropertyValue = homePrice;
  let accumulatedSunkCosts = closingCosts; // closing costs are sunk immediately

  for (let year = 1; year <= yearsToSimulate; year++) {
    // 1. Amortization for this year (12 months)
    let yearlyInterestPaid = 0;
    let endOfYearRemainingDebt = 0;

    for (let m = 1; m <= 12; m++) {
      const monthIndex = (year - 1) * 12 + (m - 1);
      if (monthIndex < amortization.length) {
        const amRow = amortization[monthIndex];
        yearlyInterestPaid += amRow.interestPayment;
        endOfYearRemainingDebt = amRow.remainingBalance;
      } else {
        // Loan is paid off
        endOfYearRemainingDebt = 0;
      }
    }

    // 2. Property Taxes for this year (based on beginning-of-year value)
    const taxes = calculateNYPropertyTaxes(
      currentPropertyValue,
      propertyTaxRates.city,
      propertyTaxRates.school,
      starExemption
    );
    const yearlyPropertyTaxes = taxes.totalTax;

    // 3. Maintenance Cost for this year
    const yearlyMaintenance = calculateMaintenanceCost(
      currentPropertyValue,
      homeAge + year - 1, // Home ages each year
      isDIY
    );

    // 4. Update accumulated sunk costs
    accumulatedSunkCosts +=
      yearlyInterestPaid +
      yearlyPropertyTaxes +
      yearlyMaintenance +
      annualInsurance;

    // 5. Update property value for the end of the year based on appreciation
    currentPropertyValue *= 1 + homeAppreciationRate;

    // 6. Calculate equity
    const equity = currentPropertyValue - endOfYearRemainingDebt;

    scenario.push({
      year,
      propertyValue: currentPropertyValue,
      remainingDebt: endOfYearRemainingDebt,
      equity,
      totalSunkCosts: accumulatedSunkCosts,
    });
  }

  return scenario;
}
