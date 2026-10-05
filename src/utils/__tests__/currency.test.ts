import { formatCurrency } from '../currency';

describe('formatCurrency', () => {
  const cases: [number, string][] = [[50, 'S/ 50.00'], [1250.5, 'S/ 1,250.50'], [-20, 'S/ -20.00']];
  test.each(cases)('formats %s', (value, expected) => expect(formatCurrency(value)).toBe(expected));
});
