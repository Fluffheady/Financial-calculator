export interface NYPropertyTaxes {
  cityTax: number;
  schoolTax: number;
  totalTax: number;
}

export function calculateNYPropertyTaxes(
  assessedValue: number,
  cityTaxRate: number, // e.g. 0.01 for 1%
  schoolTaxRate: number, // e.g. 0.02 for 2%
  starExemptionAmount: number // Fixed dollar amount reduced from taxable school value
): NYPropertyTaxes {
  // City tax is based on full assessed value
  const cityTax = assessedValue * cityTaxRate;

  // School tax allows for STAR exemption
  const taxableSchoolValue = Math.max(0, assessedValue - starExemptionAmount);
  const schoolTax = taxableSchoolValue * schoolTaxRate;

  return {
    cityTax,
    schoolTax,
    totalTax: cityTax + schoolTax,
  };
}
