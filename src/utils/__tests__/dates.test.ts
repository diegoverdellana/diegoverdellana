import { formatTransactionDate, getMonthRange, getPeriodRange, getTodayRange, getWeekRange, parseLocalDate } from '../dates';

describe('local date periods', () => {
  const date = new Date(2026, 9, 4, 16, 30);
  test('today is local midnight to the next local midnight', () => { const period = getTodayRange(date); expect(period.start).toEqual(new Date(2026, 9, 4)); expect(period.end).toEqual(new Date(2026, 9, 5)); });
  test('week starts Monday and has seven days', () => { const period = getWeekRange(date); expect(period.start).toEqual(new Date(2026, 8, 28)); expect(period.end).toEqual(new Date(2026, 9, 5)); });
  test('month has an exclusive next-month boundary', () => { const period = getMonthRange(date); expect(period.start).toEqual(new Date(2026, 9, 1)); expect(period.end).toEqual(new Date(2026, 10, 1)); });
  test('formats and validates transaction dates', () => { expect(formatTransactionDate(new Date(2026, 9, 4))).toBe('04/10/2026'); expect(parseLocalDate('2026-02-30')).toBeNull(); expect(parseLocalDate('2026-10-04')).toEqual(new Date(2026, 9, 4, 12)); });
  test('selects the requested reusable period', () => { expect(getPeriodRange('today', date)).toEqual(getTodayRange(date)); expect(getPeriodRange('week', date)).toEqual(getWeekRange(date)); expect(getPeriodRange('month', date)).toEqual(getMonthRange(date)); });
});
