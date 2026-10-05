export function calculateRevenue(amounts: readonly number[]): number {
  return amounts.reduce((total, amount) => total + amount, 0);
}

export function calculateExpenses(amounts: readonly number[]): number {
  return amounts.reduce((total, amount) => total + amount, 0);
}

export function calculateEstimatedProfit(totalSales: number, totalExpenses: number): number {
  return totalSales - totalExpenses;
}

export function calculateMargin(profit: number, revenue: number): number {
  return revenue === 0 ? 0 : (profit / revenue) * 100;
}

export function calculateMarkup(profit: number, cost: number): number {
  return cost === 0 ? 0 : (profit / cost) * 100;
}

export interface PricingInput {
  productCost: number; packagingCost: number; deliveryCost: number; advertisingCost: number;
  otherCosts: number; paymentFeePercentage: number; desiredMarginPercentage: number;
}

export interface PricingResult {
  baseCost: number; recommendedPrice: number; estimatedProfit: number; margin: number; markup: number;
}

export function calculatePriceRecommendation(input: PricingInput): PricingResult {
  const costs = [input.productCost, input.packagingCost, input.deliveryCost, input.advertisingCost, input.otherCosts];
  if (costs.some((value) => !Number.isFinite(value) || value < 0)) throw new Error('INVALID_COST');
  const percentages = [input.paymentFeePercentage, input.desiredMarginPercentage];
  if (percentages.some((value) => !Number.isFinite(value) || value < 0 || value >= 100)) throw new Error('INVALID_PERCENTAGE');
  const fee = input.paymentFeePercentage / 100;
  const desiredMargin = input.desiredMarginPercentage / 100;
  if (fee + desiredMargin >= 1) throw new Error('INVALID_PERCENTAGE_SUM');
  const baseCost = costs.reduce((total, cost) => total + cost, 0);
  const recommendedPrice = baseCost / (1 - desiredMargin - fee);
  const paymentFee = recommendedPrice * fee;
  const estimatedProfit = recommendedPrice - baseCost - paymentFee;
  return {
    baseCost, recommendedPrice, estimatedProfit,
    margin: calculateMargin(estimatedProfit, recommendedPrice),
    markup: calculateMarkup(estimatedProfit, baseCost),
  };
}
