export interface AmortizationRow {
  month: number;
  payment: number;
  principalPayment: number;
  interestPayment: number;
  remainingBalance: number;
}

export function calculateAmortizationSchedule(
  principal: number,
  annualInterestRate: number,
  years: number
): AmortizationRow[] {
  const schedule: AmortizationRow[] = [];
  const monthlyRate = annualInterestRate / 12;
  const totalMonths = years * 12;

  let remainingBalance = principal;
  let monthlyPayment = 0;

  if (monthlyRate === 0) {
    monthlyPayment = principal / totalMonths;
  } else {
    monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  for (let month = 1; month <= totalMonths; month++) {
    const interestPayment = remainingBalance * monthlyRate;
    let principalPayment = monthlyPayment - interestPayment;

    if (remainingBalance - principalPayment < 0) {
      principalPayment = remainingBalance;
      monthlyPayment = principalPayment + interestPayment;
    }

    remainingBalance -= principalPayment;

    schedule.push({
      month,
      payment: monthlyPayment,
      principalPayment,
      interestPayment,
      remainingBalance: Math.max(0, remainingBalance), // Avoid floating point -0
    });
  }

  return schedule;
}
