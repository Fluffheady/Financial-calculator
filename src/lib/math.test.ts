import { calculateRenterNetWorth, calculateBreakevenYear, HomeownerParams, RenterParams, calculateHomeownerNetWorth } from './math';

describe('Math Logic', () => {
  describe('calculateRenterNetWorth', () => {
    it('should correctly calculate compound interest for a renter', () => {
      // Invest $10,000 upfront, add $500 monthly, 5% annual return for 5 years
      const netWorth = calculateRenterNetWorth(10000, 500, 0.05, 5);

      // Expected logic check:
      // Initial $10,000 at 5% over 5 years is approx $12,833
      // $500 monthly at 5% over 5 years is approx $34,000
      // Total should be around $46,800
      expect(netWorth).toBeGreaterThan(46000);
      expect(netWorth).toBeLessThan(47000);
    });
  });

  describe('calculateHomeownerNetWorth', () => {
    it('should correctly calculate homeowner equity after 5 years', () => {
      const params: HomeownerParams = {
        homePrice: 300000,
        downPayment: 60000, // 20%
        mortgageRate: 0.04,
        mortgageTermYears: 30,
        appreciationRate: 0.03, // 3% annual
        propertyTaxRate: 0.015,
        insuranceRate: 0.005,
        maintenanceRate: 0.01,
        closingCosts: 10000
      };

      const equity = calculateHomeownerNetWorth(params, 5);

      // Initial home value $300k, appreciates at 3% for 5 years -> ~$347,782
      // Initial principal $240k, after 5 years at 4% -> ~$217,337
      // Equity should be roughly $130,445
      expect(equity).toBeGreaterThan(120000);
      expect(equity).toBeLessThan(140000);
    });
  });

  describe('calculateBreakevenYear', () => {
    it('should find a breakeven year when homeowner eventually outpaces renter', () => {
      const renterParams: RenterParams = {
        rent: 1500,
        rentInflationRate: 0.03, // 3% annual rent increase
        returnRate: 0.07 // 7% market return
      };

      const homeownerParams: HomeownerParams = {
        homePrice: 300000,
        downPayment: 60000, // 20%
        mortgageRate: 0.05,
        mortgageTermYears: 30,
        appreciationRate: 0.04, // 4% appreciation (high to force early breakeven)
        propertyTaxRate: 0.015,
        insuranceRate: 0.005,
        maintenanceRate: 0.01,
        closingCosts: 10000
      };

      const breakevenYear = calculateBreakevenYear(renterParams, homeownerParams, 30);

      // Given high appreciation, homeowner should breakeven within 30 years
      expect(breakevenYear).not.toBeNull();
      expect(breakevenYear).toBeGreaterThan(0);
      expect(breakevenYear).toBeLessThanOrEqual(30);
    });

    it('should return null if homeowner never breaks even within maxYears', () => {
      const renterParams: RenterParams = {
        rent: 1000, // Very cheap rent
        rentInflationRate: 0.01, // 1% annual rent increase
        returnRate: 0.10 // 10% market return (high)
      };

      const homeownerParams: HomeownerParams = {
        homePrice: 500000, // Expensive home
        downPayment: 25000, // 5%
        mortgageRate: 0.07, // High mortgage
        mortgageTermYears: 30,
        appreciationRate: 0.01, // 1% appreciation (low)
        propertyTaxRate: 0.02,
        insuranceRate: 0.005,
        maintenanceRate: 0.02,
        closingCosts: 15000
      };

      const breakevenYear = calculateBreakevenYear(renterParams, homeownerParams, 30);

      // Given great renting condition and poor owning condition, renter should win over 30 years
      expect(breakevenYear).toBeNull();
    });
  });
});
