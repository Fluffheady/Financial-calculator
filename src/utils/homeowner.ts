import { PropertyData, NYTaxData } from '../types';
import { calculateAnnualNYTaxes } from './taxes';

/**
 * Calculates the monthly mortgage payment (Principal + Interest).
 */
export function calculateMonthlyMortgage(principal: number, annualRate: number, years: number): number {
  if (annualRate === 0) return principal / (years * 12);
  const monthlyRate = annualRate / 12;
  const numPayments = years * 12;
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
}

/**
 * Calculates maintenance costs based on the DEFAULTS.md rules:
 * 3% base, reduced by 0.25% per sweat equity slider notch, floor of 1.5%.
 */
export function calculateMaintenanceRate(diySlider: number): number {
    const baseRate = 0.03;
    const discount = diySlider * 0.0025;
    const effectiveRate = baseRate - discount;
    return Math.max(0.015, effectiveRate); // Hard floor of 1.5% for parts
}

export interface HomeownerYearlyStatus {
  propertyValue: number;
  remainingPrincipal: number;
  equity: number;
  annualSunkCosts: number; // Taxes, Maintenance, Mortgage Interest, Insurance
  cumulativeSunkCosts: number;
  netWorth: number; // Equity - Cumulative Sunk Costs - Seller Closing Costs (if sold this year)
}

/**
 * Generates the full 30-year Homeowner financial model.
 */
export function generateHomeownerSchedule(
  property: PropertyData,
  taxData: NYTaxData,
  annualInsurance: number
): HomeownerYearlyStatus[] {
  const schedule: HomeownerYearlyStatus[] = [];

  const downPayment = property.price * property.downPaymentPercent;
  let remainingPrincipal = property.price - downPayment;
  let currentPropertyValue = property.price;

  const monthlyMortgage = calculateMonthlyMortgage(remainingPrincipal, property.mortgageRate, property.loanTermYears);
  const maintenanceRate = calculateMaintenanceRate(property.diyExperienceSlider);

  // Buyer closing costs (Default 3.5%) are considered an immediate sunk cost in Year 0.
  let cumulativeSunkCosts = property.price * 0.035;

  for (let year = 1; year <= 30; year++) {
    let annualInterestPaid = 0;
    let annualPrincipalPaid = 0;

    // Process 12 months of mortgage payments
    for (let month = 1; month <= 12; month++) {
        if (remainingPrincipal > 0) {
            const interestPayment = remainingPrincipal * (property.mortgageRate / 12);
            const principalPayment = monthlyMortgage - interestPayment;

            annualInterestPaid += interestPayment;
            annualPrincipalPaid += principalPayment;
            remainingPrincipal -= principalPayment;
        }
    }

    // Taxes recalculate each year based on appreciating assessed value (assuming assessed value tracks market value)
    taxData.assessedValue = currentPropertyValue;
    const annualTaxes = calculateAnnualNYTaxes(taxData);
    const annualMaintenance = currentPropertyValue * maintenanceRate;

    const annualSunkCosts = annualTaxes + annualMaintenance + annualInterestPaid + annualInsurance;
    cumulativeSunkCosts += annualSunkCosts;

    currentPropertyValue *= (1 + property.appreciationRate);
    const equity = currentPropertyValue - Math.max(0, remainingPrincipal);

    // If sold this year, seller closing costs apply (Default 8%)
    const sellerClosingCosts = currentPropertyValue * 0.08;
    // Sunk costs are cash flows, not equity deductions. They are accounted for by the renter investing the surplus.
    const netWorthIfSold = equity - sellerClosingCosts;

    schedule.push({
      propertyValue: currentPropertyValue,
      remainingPrincipal: Math.max(0, remainingPrincipal),
      equity,
      annualSunkCosts,
      cumulativeSunkCosts,
      netWorth: netWorthIfSold
    });
  }

  return schedule;
}
