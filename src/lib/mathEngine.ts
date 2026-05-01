export interface CalculationInputs {
  homePrice: number;
  downPaymentPercent: number;
  expectedMarketReturn: number; // in percent (e.g., 7 for 7%)
  maintenanceCostPercent: number; // in percent per year (e.g., 1 for 1%)
  propertyAppreciation: number; // in percent per year (e.g., 3 for 3%)
  rentGrowth: number; // in percent per year (e.g., 2 for 2%)
  monthlyRent: number;
}

export interface CalculationOutputs {
  breakevenYear: number | null; // null if never breaks even in 30 years
  homeownerNetWorth: number;
  renterNetWorth: number;
}

/**
 * Dummy calculation function to satisfy UI requirements until the true math engine is implemented.
 */
export function calculateBreakeven(inputs: CalculationInputs): CalculationOutputs {
  // Simple dummy math to make sliders feel responsive
  const downPaymentAmount = inputs.homePrice * (inputs.downPaymentPercent / 100);

  // Calculate final value after 30 years with simple compound interest approximation
  // Renter: Initial investment is down payment, grows at expectedMarketReturn
  const renterReturnRate = 1 + (inputs.expectedMarketReturn / 100);
  const renterNetWorth = downPaymentAmount * Math.pow(renterReturnRate, 30);

  // Homeowner: Property appreciation minus maintenance over 30 years
  const netAppreciationRate = 1 + ((inputs.propertyAppreciation - inputs.maintenanceCostPercent) / 100);
  const homeownerNetWorth = inputs.homePrice * Math.pow(netAppreciationRate, 30);

  // Dummy breakeven logic
  let breakevenYear = 15; // default dummy
  if (homeownerNetWorth > renterNetWorth * 1.5) {
      breakevenYear = 10;
  } else if (renterNetWorth > homeownerNetWorth * 1.5) {
      breakevenYear = 20;
  }

  // Cap if never breaks even
  if (renterNetWorth > homeownerNetWorth * 2) {
      breakevenYear = null as any;
  }

  return {
    breakevenYear,
    homeownerNetWorth: Math.round(homeownerNetWorth),
    renterNetWorth: Math.round(renterNetWorth)
  };
}
