export function calculateMaintenanceCost(
  homeValue: number,
  age: number,
  isDIY: boolean
): number {
  // Base maintenance cost logic
  // Newer homes (<= 10 years): 1% of home value
  // Medium age homes (11 - 30 years): 1.5% of home value
  // Older homes (> 30 years): 2% of home value (Northeast older housing stock adjustment)
  let basePercentage = 0.01;
  if (age > 30) {
    basePercentage = 0.02;
  } else if (age > 10) {
    basePercentage = 0.015;
  }

  let totalCost = homeValue * basePercentage;

  // "Sweat Equity" adjustment
  // Assuming labor is ~50% of typical maintenance costs, DIY reduces the total by 40% (leaving 10% for specialized labor and 50% for materials)
  if (isDIY) {
    totalCost *= 0.6;
  }

  return totalCost;
}
