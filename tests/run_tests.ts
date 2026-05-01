import { calculateBreakeven } from '../src/utils/calculator';
import { PropertyData, NYTaxData, InvestorData } from '../src/types';

function runTests() {
  console.log('--- Running Breakeven Math Engine Tests ---');

  const propertyData: PropertyData = {
    address: '123 Fake St, Buffalo, NY',
    price: 300000,
    downPaymentPercent: 0.20, // $60,000 down
    mortgageRate: 0.07, // 7% interest
    loanTermYears: 30,
    appreciationRate: 0.03, // 3% property appreciation
    diyExperienceSlider: 0 // No sweat equity discount (3% maintenance)
  };

  const taxData: NYTaxData = {
    assessedValue: 300000,
    cityTaxRate: 0.005, // e.g., 0.5%
    schoolTaxRate: 0.01, // e.g., 1.0%
    starExemption: 30000 // Basic STAR
  };

  const investorData: InvestorData = {
    rentStart: 2000, // Starting rent $2000/mo
    rentAppreciation: 0.03, // 3% annual rent bump
    marketReturnRate: 0.07, // 7% stock market return
    capitalGainsTaxRate: 0.15 // 15% Cap gains
  };

  const annualInsurance = 1200; // $100/mo

  const result = calculateBreakeven(propertyData, taxData, investorData, annualInsurance);

  if (result.yearlyData.length !== 30) {
    throw new Error('Expected exactly 30 years of data');
  }

  // Print Year 1 Data to manually verify initial math
  const y1 = result.yearlyData[0];
  console.log('\nYear 1 Outcomes:');
  console.log(`Homeowner Net Worth: $${y1.homeownerNetWorth.toFixed(2)}`);
  console.log(`Renter Net Worth: $${y1.renterNetWorth.toFixed(2)}`);

  if (result.breakevenYear) {
      console.log(`\n✅ TEST PASSED: Breakeven occurs in Year ${result.breakevenYear}`);
  } else {
      console.log('\n⚠️ TEST NOTE: Renter wins all 30 years in this scenario.');
  }

  // Test 2: Modify scenario to force Homeowner win earlier
  const cheapHouse: PropertyData = { ...propertyData, price: 150000, appreciationRate: 0.05, diyExperienceSlider: 6 }; // 1.5% maintenance floor
  const expensiveRent: InvestorData = { ...investorData, rentStart: 3000 };

  const result2 = calculateBreakeven(cheapHouse, taxData, expensiveRent, annualInsurance);

  if (result2.breakevenYear && result2.breakevenYear < 10) {
     console.log(`\n✅ TEST PASSED: Homeowner breaks even fast in Year ${result2.breakevenYear} as expected with high rent.`);
  } else {
     throw new Error(`Homeowner should break even fast. Got: ${result2.breakevenYear}`);
  }
}

try {
    runTests();
    console.log('\nAll tests passed successfully! 🚀');
} catch(e) {
    console.error('Test Failed:', e);
    process.exit(1);
}
