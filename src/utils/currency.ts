export function formatCurrency(value: number, symbol = 'S/'): string {
  const formatted = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  return `${symbol} ${formatted}`;
}
