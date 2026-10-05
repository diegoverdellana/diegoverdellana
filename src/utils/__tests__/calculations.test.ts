import { calculateEstimatedProfit, calculateMargin, calculateMarkup, calculatePriceRecommendation } from '../calculations';

describe('business calculations', () => {
  test('calculates Estimated Profit', () => expect(calculateEstimatedProfit(100, 30)).toBe(70));
  test('calculates margin', () => expect(calculateMargin(30, 100)).toBe(30));
  test('calculates markup', () => expect(calculateMarkup(30, 60)).toBe(50));

  test('calculates the required pricing example', () => {
    const result = calculatePriceRecommendation({ productCost: 50, packagingCost: 5, deliveryCost: 0, advertisingCost: 5, otherCosts: 0, paymentFeePercentage: 3, desiredMarginPercentage: 30 });
    expect(result.baseCost).toBe(60);
    expect(result.recommendedPrice).toBeCloseTo(60 / (1 - 0.3 - 0.03));
    expect(result.estimatedProfit).toBeCloseTo(result.recommendedPrice - 60 - result.recommendedPrice * 0.03);
    expect(result.margin).toBeCloseTo(30);
    expect(result.markup).toBeCloseTo((result.estimatedProfit / 60) * 100);
  });

  test('rejects margin plus fee at or above 100%', () => {
    expect(() => calculatePriceRecommendation({ productCost: 1, packagingCost: 0, deliveryCost: 0, advertisingCost: 0, otherCosts: 0, paymentFeePercentage: 10, desiredMarginPercentage: 90 })).toThrow('INVALID_PERCENTAGE_SUM');
  });
});
