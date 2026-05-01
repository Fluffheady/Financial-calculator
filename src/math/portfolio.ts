import { CoreHolding } from './types.js';

/**
 * Calculates the blended expected return rate of a custom portfolio.
 * Ensure weights sum to approximately 1.0.
 */
export function calculateBlendedReturn(holdings: CoreHolding[]): number {
    if (holdings.length === 0) return 0;

    const totalWeight = holdings.reduce((sum, h) => sum + h.weight, 0);

    // Normalize weights just in case they don't perfectly sum to 1
    // or if they are entered as percentages like 80 instead of 0.8
    const normalizedHoldings = totalWeight === 0
        ? holdings
        : holdings.map(h => ({ ...h, weight: h.weight / totalWeight }));

    return normalizedHoldings.reduce((blendedReturn, holding) => {
        return blendedReturn + (holding.weight * holding.expectedReturn);
    }, 0);
}
