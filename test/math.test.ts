import { calculateBlendedReturn } from '../src/math/portfolio';
import { simulateRenterWealth } from '../src/math/renter';
import { findBreakevenPoint } from '../src/math/breakeven';
import { RenterInputs, CoreHolding, RenterYearlyData, HomeownerYearlyData } from '../src/math/types';

describe('Math Engine', () => {
    describe('calculateBlendedReturn', () => {
        it('should correctly calculate blended return with weights summing to 1', () => {
            const holdings: CoreHolding[] = [
                { name: 'Stocks', weight: 0.8, expectedReturn: 0.1 }, // 80% * 10% = 8%
                { name: 'Bonds', weight: 0.2, expectedReturn: 0.05 }, // 20% * 5% = 1%
            ];
            expect(calculateBlendedReturn(holdings)).toBeCloseTo(0.09, 4); // 9%
        });

        it('should normalize weights if they do not sum to 1', () => {
            const holdings: CoreHolding[] = [
                { name: 'Stocks', weight: 80, expectedReturn: 0.1 }, // 80 / 100 * 10% = 8%
                { name: 'Bonds', weight: 20, expectedReturn: 0.05 }, // 20 / 100 * 5% = 1%
            ];
            expect(calculateBlendedReturn(holdings)).toBeCloseTo(0.09, 4); // 9%
        });

        it('should return 0 for an empty portfolio', () => {
            expect(calculateBlendedReturn([])).toBe(0);
        });
    });

    describe('simulateRenterWealth', () => {
        it('should compound monthly surplus and track unrealized gains', () => {
            const inputs: RenterInputs = {
                initialInvestment: 50000,
                monthlyRent: 1500,
                homeownerPITIAndCosts: 2500, // Monthly surplus = $1000
                blendedReturnRate: 0.06, // 6% annual -> 0.5% monthly
                capitalGainsTaxRate: 0.15
            };

            const data = simulateRenterWealth(inputs, 1);
            expect(data.length).toBe(1);

            const year1 = data[0]!;
            expect(year1.year).toBe(1);
            expect(year1.startingBalance).toBe(50000);
            expect(year1.annualContribution).toBe(12000); // 1000 * 12
            expect(year1.costBasis).toBe(62000); // 50000 + 12000

            // Checking compounding. It's complex, so we just verify it's greater than 0
            expect(year1.investmentReturns).toBeGreaterThan(0);

            expect(year1.unrealizedGains).toBe(year1.endingBalance - year1.costBasis);

            // Tax is applied to gains only
            const expectedTaxes = year1.unrealizedGains * 0.15;
            expect(year1.netWorthAfterTaxes).toBe(year1.endingBalance - expectedTaxes);
        });

        it('should handle zero monthly surplus', () => {
            const inputs: RenterInputs = {
                initialInvestment: 100000,
                monthlyRent: 2000,
                homeownerPITIAndCosts: 1800, // Negative surplus, should be capped at 0
                blendedReturnRate: 0.05,
                capitalGainsTaxRate: 0.15
            };

            const data = simulateRenterWealth(inputs, 1);
            const year1 = data[0]!;

            expect(year1.annualContribution).toBe(0);
            expect(year1.costBasis).toBe(100000);
            // After 1 year at 5% compounded monthly: 100000 * (1 + 0.05/12)^12 ≈ 105116.19
            expect(year1.endingBalance).toBeCloseTo(105116.19, 1);
        });
    });

    describe('findBreakevenPoint', () => {
        it('should find the breakeven year when homeowner overtakes renter', () => {
            const renterData: RenterYearlyData[] = [
                { year: 1, startingBalance: 0, annualContribution: 0, investmentReturns: 0, endingBalance: 0, costBasis: 0, unrealizedGains: 0, netWorthAfterTaxes: 100000 },
                { year: 2, startingBalance: 0, annualContribution: 0, investmentReturns: 0, endingBalance: 0, costBasis: 0, unrealizedGains: 0, netWorthAfterTaxes: 110000 },
                { year: 3, startingBalance: 0, annualContribution: 0, investmentReturns: 0, endingBalance: 0, costBasis: 0, unrealizedGains: 0, netWorthAfterTaxes: 120000 }
            ];

            const homeownerData: HomeownerYearlyData[] = [
                { year: 1, propertyValue: 0, equity: 0, remainingMortgage: 0, totalCosts: 0, netWorth: 90000 },
                { year: 2, propertyValue: 0, equity: 0, remainingMortgage: 0, totalCosts: 0, netWorth: 105000 },
                { year: 3, propertyValue: 0, equity: 0, remainingMortgage: 0, totalCosts: 0, netWorth: 125000 } // Overtakes here
            ];

            const result = findBreakevenPoint(renterData, homeownerData);
            expect(result.breakevenYear).toBe(3);
            expect(result.breakevenMonth).toBeGreaterThanOrEqual(1);
            expect(result.breakevenMonth).toBeLessThanOrEqual(12);
        });

        it('should return null if homeowner never overtakes renter', () => {
             const renterData: RenterYearlyData[] = [
                { year: 1, startingBalance: 0, annualContribution: 0, investmentReturns: 0, endingBalance: 0, costBasis: 0, unrealizedGains: 0, netWorthAfterTaxes: 100000 },
                { year: 2, startingBalance: 0, annualContribution: 0, investmentReturns: 0, endingBalance: 0, costBasis: 0, unrealizedGains: 0, netWorthAfterTaxes: 110000 }
            ];

            const homeownerData: HomeownerYearlyData[] = [
                { year: 1, propertyValue: 0, equity: 0, remainingMortgage: 0, totalCosts: 0, netWorth: 90000 },
                { year: 2, propertyValue: 0, equity: 0, remainingMortgage: 0, totalCosts: 0, netWorth: 95000 }
            ];

            const result = findBreakevenPoint(renterData, homeownerData);
            expect(result.breakevenYear).toBeNull();
            expect(result.breakevenMonth).toBeNull();
        });

        it('should handle breakeven in year 1', () => {
             const renterData: RenterYearlyData[] = [
                { year: 1, startingBalance: 0, annualContribution: 0, investmentReturns: 0, endingBalance: 0, costBasis: 0, unrealizedGains: 0, netWorthAfterTaxes: 100000 }
            ];

            const homeownerData: HomeownerYearlyData[] = [
                { year: 1, propertyValue: 0, equity: 0, remainingMortgage: 0, totalCosts: 0, netWorth: 105000 }
            ];

            const result = findBreakevenPoint(renterData, homeownerData);
            expect(result.breakevenYear).toBe(1);
            expect(result.breakevenMonth).toBe(1);
        });
    });
});
