export interface HomeownerParams {
  homePrice: number;
  downPayment: number;
  mortgageRate: number; // annual
  mortgageTermYears: number;
  appreciationRate: number; // annual
  propertyTaxRate: number; // annual, as percentage of home value
  insuranceRate: number; // annual, as percentage of home value
  maintenanceRate: number; // annual, as percentage of home value
  closingCosts: number; // upfront
}

export interface RenterParams {
  rent: number; // monthly
  rentInflationRate: number; // annual
  returnRate: number; // annual return on investment
}

export function calculateRenterNetWorth(
  initialInvestment: number,
  monthlyInvestment: number,
  returnRate: number,
  years: number
): number {
  const months = years * 12;
  const monthlyReturnRate = returnRate / 12;

  let netWorth = initialInvestment;
  for (let i = 0; i < months; i++) {
    netWorth = netWorth * (1 + monthlyReturnRate) + monthlyInvestment;
  }

  return netWorth;
}

export function calculateMortgagePayment(principal: number, annualRate: number, years: number): number {
  if (annualRate === 0) return principal / (years * 12);
  const monthlyRate = annualRate / 12;
  const numPayments = years * 12;
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
}

export function calculateHomeownerNetWorth(params: HomeownerParams, years: number): number {
  const principal = params.homePrice - params.downPayment;
  const monthlyMortgagePayment = calculateMortgagePayment(principal, params.mortgageRate, params.mortgageTermYears);

  let currentHomeValue = params.homePrice * Math.pow(1 + params.appreciationRate, years);

  // Calculate remaining principal
  const monthlyRate = params.mortgageRate / 12;
  const numPayments = params.mortgageTermYears * 12;
  const paymentsMade = years * 12;

  let remainingPrincipal = principal;
  if (paymentsMade < numPayments) {
    remainingPrincipal = principal * (Math.pow(1 + monthlyRate, numPayments) - Math.pow(1 + monthlyRate, paymentsMade)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  } else {
    remainingPrincipal = 0;
  }

  const equity = currentHomeValue - remainingPrincipal;
  return equity;
}

export function calculateBreakevenYear(renterParams: RenterParams, homeownerParams: HomeownerParams, maxYears: number = 30): number | null {
  const principal = homeownerParams.homePrice - homeownerParams.downPayment;
  const monthlyMortgagePayment = calculateMortgagePayment(principal, homeownerParams.mortgageRate, homeownerParams.mortgageTermYears);

  let currentRent = renterParams.rent;
  let renterNetWorth = homeownerParams.downPayment + homeownerParams.closingCosts; // Initial investment

  for (let year = 1; year <= maxYears; year++) {
    // Calculate homeowner costs for the year
    const currentHomeValue = homeownerParams.homePrice * Math.pow(1 + homeownerParams.appreciationRate, year - 1);
    const annualPropertyTax = currentHomeValue * homeownerParams.propertyTaxRate;
    const annualInsurance = currentHomeValue * homeownerParams.insuranceRate;
    const annualMaintenance = currentHomeValue * homeownerParams.maintenanceRate;

    const monthlyHomeownerCost = monthlyMortgagePayment + (annualPropertyTax + annualInsurance + annualMaintenance) / 12;

    // The difference is what the renter invests (or consumes if negative, but typically homeowner costs > rent initially)
    const monthlyDifference = monthlyHomeownerCost - currentRent;

    // Calculate renter net worth after this year
    const monthlyReturnRate = renterParams.returnRate / 12;
    for (let month = 0; month < 12; month++) {
       renterNetWorth = renterNetWorth * (1 + monthlyReturnRate) + Math.max(0, monthlyDifference);
    }

    // Update rent for next year
    currentRent *= (1 + renterParams.rentInflationRate);

    // Check homeowner net worth
    const homeownerNetWorth = calculateHomeownerNetWorth(homeownerParams, year);

    if (homeownerNetWorth > renterNetWorth) {
      return year;
    }
  }

  return null; // Never breakeven within maxYears
}
