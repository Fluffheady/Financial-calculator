import * as assert from "assert";
import { calculateAmortizationSchedule } from "../src/utils/amortization";
import { calculateNYPropertyTaxes } from "../src/utils/taxes";
import { calculateMaintenanceCost } from "../src/utils/maintenance";
import { simulateHomeownerScenario } from "../src/utils/homeowner";

function runTests() {
  console.log("Running Amortization Tests...");
  const schedule = calculateAmortizationSchedule(100000, 0.05, 30);
  assert.strictEqual(schedule.length, 360, "Schedule should have 360 months");
  // $100k at 5% over 30 years -> Monthly payment around $536.82
  assert.ok(Math.abs(schedule[0].payment - 536.82) < 0.1, "First payment should be approx 536.82");
  assert.ok(schedule[359].remainingBalance < 1, "Final remaining balance should be close to 0");

  console.log("Running NY Taxes Tests...");
  const taxes1 = calculateNYPropertyTaxes(200000, 0.01, 0.02, 30000);
  assert.strictEqual(taxes1.cityTax, 2000, "City tax on 200k at 1% should be 2000");
  assert.strictEqual(taxes1.schoolTax, 3400, "School tax on (200k - 30k) at 2% should be 3400");
  assert.strictEqual(taxes1.totalTax, 5400, "Total tax should be 5400");

  const taxes2 = calculateNYPropertyTaxes(20000, 0.01, 0.02, 30000);
  assert.strictEqual(taxes2.schoolTax, 0, "School tax should not be negative when STAR exceeds value");

  console.log("Running Maintenance Tests...");
  // New home (age 5): 1%
  assert.strictEqual(calculateMaintenanceCost(100000, 5, false), 1000, "New home non-DIY should be 1%");
  // Old home (age 35): 2%
  assert.strictEqual(calculateMaintenanceCost(100000, 35, false), 2000, "Old home non-DIY should be 2%");
  // DIY discount (60% of original cost)
  assert.strictEqual(calculateMaintenanceCost(100000, 35, true), 1200, "Old home DIY should be 2% * 0.6");

  console.log("Running Homeowner Scenario Tests...");
  const scenario = simulateHomeownerScenario(
    300000,     // homePrice
    60000,      // downPayment (20%) -> 240k principal
    0.05,       // loanInterestRate
    30,         // loanYears
    { city: 0.01, school: 0.02 }, // taxRates
    30000,      // starExemption
    15,         // homeAge (1.5% maintenance base)
    false,      // isDIY
    1000,       // annualInsurance
    5000,       // closingCosts
    0.03,       // appreciationRate
    5           // yearsToSimulate
  );

  assert.strictEqual(scenario.length, 5, "Scenario should have 5 years");
  const year1 = scenario[0];
  assert.strictEqual(year1.year, 1);
  assert.ok(year1.propertyValue > 300000, "Property should appreciate");
  assert.ok(year1.remainingDebt < 240000, "Debt should decrease");
  assert.ok(year1.equity > 60000, "Equity should increase");

  // Year 1 Sunk Costs Check
  // Interest ~ 11,922
  // Taxes = (300k * 0.01) + (270k * 0.02) = 3000 + 5400 = 8400
  // Maintenance (15 yrs -> 1.5%) = 300k * 0.015 = 4500
  // Insurance = 1000
  // Closing costs = 5000
  // Expected roughly 11922 + 8400 + 4500 + 1000 + 5000 = 30822
  assert.ok(year1.totalSunkCosts > 30000 && year1.totalSunkCosts < 32000, "Sunk costs roughly expected value");

  console.log("All tests passed!");
}

runTests();
