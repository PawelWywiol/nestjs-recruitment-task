import { SECOND_IN_MILLISECONDS } from './date.config';
import type { DateRange } from './date.types';

const isDate = (value: unknown): value is Date =>
  value instanceof Date || (typeof value === 'string' && !Number.isNaN(Date.parse(value)));

export const normalizeDateToSeconds = (date: Date | string): Date | null => {
  if (!isDate(date)) {
    return null;
  }

  const d = new Date(date);
  d.setMilliseconds(0);
  return d;
};

export const resolveDateRangeInSeconds = (date: Date | string): DateRange | null => {
  if (!isDate(date)) {
    return null;
  }

  const d = new Date(date);

  return {
    gte: new Date(d.getTime() - SECOND_IN_MILLISECONDS),
    lt: new Date(d.getTime() + SECOND_IN_MILLISECONDS),
  };
};
