import type { DatePeriod } from '../types/transaction';

const startOfDay = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export function getTodayRange(now = new Date()): DatePeriod {
  const start = startOfDay(now);
  const end = new Date(start); end.setDate(end.getDate() + 1);
  return { start, end };
}

export function getWeekRange(now = new Date()): DatePeriod {
  const start = startOfDay(now);
  const dayFromMonday = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - dayFromMonday);
  const end = new Date(start); end.setDate(end.getDate() + 7);
  return { start, end };
}

export function getMonthRange(now = new Date()): DatePeriod {
  return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: new Date(now.getFullYear(), now.getMonth() + 1, 1) };
}

export function formatTransactionDate(date: Date): string {
  return new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
}

export function parseLocalDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]); const month = Number(match[2]); const day = Number(match[3]);
  const date = new Date(year, month - 1, day, 12);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}

export function toDateInput(date = new Date()): string {
  const pad = (value: number): string => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
