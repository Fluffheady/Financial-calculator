export interface CoreHolding {
    name: string;
    weight: number; // e.g., 0.8 for 80%
    expectedReturn: number; // e.g., 0.08 for 8%
}

export interface RenterInputs {
    initialInvestment: number; // Down payment + closing costs
    monthlyRent: number;
    homeownerPITIAndCosts: number; // PITI + maintenance + etc.
    blendedReturnRate: number; // Annual rate, e.g., 0.08
    capitalGainsTaxRate: number; // e.g., 0.15 for 15%
}

export interface RenterYearlyData {
    year: number;
    startingBalance: number;
    annualContribution: number;
    investmentReturns: number;
    endingBalance: number;
    costBasis: number;
    unrealizedGains: number;
    netWorthAfterTaxes: number;
}

export interface HomeownerYearlyData {
    year: number;
    propertyValue: number;
    equity: number;
    remainingMortgage: number;
    totalCosts: number;
    netWorth: number;
}

export interface SimulationOutput {
    renterData: RenterYearlyData[];
    breakevenYear: number | null;
    breakevenMonth: number | null; // Optional: for higher fidelity
}
