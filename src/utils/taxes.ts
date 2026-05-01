import { NYTaxData } from '../types';

/**
 * Calculates NY specific property taxes using the 62/38 split and applying
 * the STAR exemption specifically to the school tax portion.
 */
export function calculateAnnualNYTaxes(data: NYTaxData): number {
  const { assessedValue, cityTaxRate, schoolTaxRate, starExemption } = data;

  // City tax is applied to the full assessed value
  const cityTax = assessedValue * cityTaxRate;

  // School tax has the STAR deduction applied first (minimum taxable value is 0)
  const taxableSchoolValue = Math.max(0, assessedValue - starExemption);
  const schoolTax = taxableSchoolValue * schoolTaxRate;

  return cityTax + schoolTax;
}

/**
 * Helper to derive default NY tax rates based on a total property tax rate.
 * Uses the DEFAULTS.md rule: ~62% school, 38% city.
 */
export function deriveNYTaxRates(totalRate: number): { cityTaxRate: number, schoolTaxRate: number } {
    return {
        schoolTaxRate: totalRate * 0.62,
        cityTaxRate: totalRate * 0.38
    };
}
