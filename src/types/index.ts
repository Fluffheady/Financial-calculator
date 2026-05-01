export interface PropertyData {
  address: string;
  price: number;
  downPaymentPercent: number;
  mortgageRate: number;
  loanTermYears: number;
  appreciationRate: number;
  diyExperienceSlider: number; // 0 to max slots (each slot reduces maintenance by 0.25%)
}

export interface NYTaxData {
  assessedValue: number;
  cityTaxRate: number; // Applied to full assessed value
  schoolTaxRate: number; // Applied to (assessed value - STAR)
  starExemption: number; // Default $30,000
}

export interface InvestorData {
  rentStart: number;
  rentAppreciation: number;
  marketReturnRate: number; // Blended return rate from custom tickers
  capitalGainsTaxRate: number; // e.g. 0.15 for Federal + NY state rate
}

export interface YearlyNetWorth {
  year: number;
  homeownerNetWorth: number;
  renterNetWorth: number;
  isBreakeven: boolean;
}
