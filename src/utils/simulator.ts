export interface SimulationParams {
  homePrice: number;
  monthlyRent: number;
  marketReturnRate: number; // e.g. 0.07 for 7%
  homeAppreciationRate: number; // e.g. 0.03 for 3%
  downPaymentPercent: number; // e.g. 0.2 for 20%
}

export interface YearData {
  year: number;
  homeNetWorth: number;
  renterNetWorth: number;
  isBreakeven: boolean;
}

export function generateSimulationData(params: SimulationParams): YearData[] {
  const data: YearData[] = [];
  let currentHomeValue = params.homePrice;

  const downPayment = params.homePrice * params.downPaymentPercent;
  const loanAmount = params.homePrice - downPayment;
  // Simple assumption for mortgage: 5% fixed over 30 years
  const mortgageRate = 0.05;
  const numPayments = 30 * 12;
  const monthlyRate = mortgageRate / 12;

  let monthlyMortgage = 0;
  if (monthlyRate > 0) {
    monthlyMortgage = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  } else {
    monthlyMortgage = loanAmount / numPayments;
  }

  // Renter starts with downpayment as investment
  let currentRenterInvestment = downPayment;
  let remainingLoan = loanAmount;

  // Track breakeven
  let breakevenFound = false;

  for (let year = 1; year <= 30; year++) {
    // 1. Homeowner Math
    currentHomeValue *= (1 + params.homeAppreciationRate);

    // Pay down mortgage for a year (rough approximation)
    for(let m = 0; m < 12; m++) {
      const interestPayment = remainingLoan * monthlyRate;
      const principalPayment = monthlyMortgage - interestPayment;
      remainingLoan -= principalPayment;
    }

    if (remainingLoan < 0) remainingLoan = 0;

    // Simplification: Home Net Worth = Home Value - Remaining Loan
    const homeNetWorth = Math.round(currentHomeValue - remainingLoan);

    // 2. Renter Math
    // Annual market return
    currentRenterInvestment *= (1 + params.marketReturnRate);

    // Add monthly savings to investment
    // Suppose monthly property tax + insurance + maintenance is roughly 2% of initial home price annually
    const monthlyExtraCostsHome = (params.homePrice * 0.02) / 12;
    const totalMonthlyHomeCost = monthlyMortgage + monthlyExtraCostsHome;

    // Difference between what homeowner pays and renter pays
    const monthlyDifference = totalMonthlyHomeCost - params.monthlyRent;

    if (monthlyDifference > 0) {
      // Renter invests the difference
      for(let m = 0; m < 12; m++) {
        currentRenterInvestment += monthlyDifference;
        // monthly compounding for the difference
        currentRenterInvestment *= (1 + params.marketReturnRate / 12);
      }
    } else {
      // Homeowner is paying less than renter, renter has to draw down investment
      for(let m = 0; m < 12; m++) {
        currentRenterInvestment += monthlyDifference;
        currentRenterInvestment *= (1 + params.marketReturnRate / 12);
      }
    }

    const renterNetWorth = Math.round(currentRenterInvestment);

    let isBreakeven = false;
    if (!breakevenFound && homeNetWorth > renterNetWorth) {
      isBreakeven = true;
      breakevenFound = true;
    }

    data.push({
      year,
      homeNetWorth,
      renterNetWorth,
      isBreakeven
    });

    // Rent goes up by 3% a year
    params.monthlyRent *= 1.03;
  }

  return data;
}
