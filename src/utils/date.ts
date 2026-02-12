import dayjs, { extend, type Dayjs } from 'dayjs';
import isSameOrAfterPlugin from 'dayjs/plugin/isSameOrAfter';
import isSameOrBeforePlugin from 'dayjs/plugin/isSameOrBefore';
import isTodayPlugin from 'dayjs/plugin/isToday';
import isTomorrowPlugin from 'dayjs/plugin/isTomorrow';
import relativeTimePlugin from 'dayjs/plugin/relativeTime';

extend(isSameOrAfterPlugin);
extend(isSameOrBeforePlugin);
extend(isTodayPlugin);
extend(isTomorrowPlugin);
extend(relativeTimePlugin);

export const DATE_ONLY_FORMAT = 'YYYY-MM-DD';
export const TIME_ONLY_FORMAT = 'HH:mm';
export const DISPLAY_DATE_FORMAT = 'DD MMM YYYY';
export const DISPLAY_TIME_FORMAT = 'HH:mm';

const ISO_DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';
const FALLBACK_TIME = '00:00';

const parseDateInput = (value?: string | null): Dayjs | null => {
  if (!value || typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const strictParsed = dayjs(
    trimmed,
    [
      DATE_ONLY_FORMAT,
      TIME_ONLY_FORMAT,
      'H:mm',
      'HH:mm:ss',
      'YYYY-MM-DDTHH:mm:ssZ',
    ],
    true,
  );

  if (strictParsed.isValid()) return strictParsed;

  const fallbackParsed = dayjs(trimmed);
  return fallbackParsed.isValid() ? fallbackParsed : null;
};

const getValidDate = (value?: string | null): Dayjs => {
  return parseDateInput(value) ?? dayjs();
};

const formatDuration = (totalMinutes: number): string => {
  const absMinutes = Math.max(0, totalMinutes);
  const hours = Math.floor(absMinutes / 60);
  const minutes = absMinutes % 60;

  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
};

// VALIDATION
export const isValidDate = (date: string | null | undefined): boolean => {
  return parseDateInput(date) !== null;
};

// DATE FORMATTING
export const formatDate = (
  date: string | null,
  format: string = DATE_ONLY_FORMAT,
): string => {
  return getValidDate(date).format(format);
};

export const formatMonth = (date: string | null): string => {
  return formatDate(date, 'MMMM');
};

export const formatMonthYear = (date: string | null): string => {
  return formatDate(date, 'MMMM YYYY');
};

export const formatDayMonth = (date: string | null): string => {
  return formatDate(date, 'MMM D');
};

export const formatFullDate = (date: string | null): string => {
  return formatDate(date, 'dddd, MMMM D, YYYY');
};

export const formatTime = (date: string | null): string => {
  return formatDate(date, 'h:mm A');
};

export const formatDateTime = (date: string | null): string => {
  return formatDate(date, 'MMM D, YYYY h:mm A');
};

// DATE COMPARISON
export const isToday = (date: string | null): boolean => {
  const parsed = parseDateInput(date);
  return parsed ? parsed.isToday() : false;
};

export const isTomorrow = (date: string | null): boolean => {
  const parsed = parseDateInput(date);
  return parsed ? parsed.isTomorrow() : false;
};

export const isPast = (date: string | null): boolean => {
  const parsed = parseDateInput(date);
  return parsed ? parsed.isBefore(dayjs(), 'day') : false;
};

export const isFuture = (date: string | null): boolean => {
  const parsed = parseDateInput(date);
  return parsed ? parsed.isAfter(dayjs(), 'day') : false;
};

export const isSameDay = (
  date1: string | null,
  date2: string | null,
): boolean => {
  const parsed1 = parseDateInput(date1);
  const parsed2 = parseDateInput(date2);

  if (!parsed1 || !parsed2) return false;
  return parsed1.isSame(parsed2, 'day');
};

// DATE MANIPULATION
export const addDays = (date: string | null, days: number): string => {
  return getValidDate(date).add(days, 'day').format(DATE_ONLY_FORMAT);
};

export const subtractDays = (date: string | null, days: number): string => {
  return getValidDate(date).subtract(days, 'day').format(DATE_ONLY_FORMAT);
};

export const startOfDay = (date: string | null): string => {
  return getValidDate(date).startOf('day').toISOString();
};

export const endOfDay = (date: string | null): string => {
  return getValidDate(date).endOf('day').toISOString();
};

// DURATION CALCULATION
export const getDuration = (
  startDate: string | null,
  endDate: string | null,
): {
  hours: number;
  minutes: number;
  totalMinutes: number;
  formatted: string;
} => {
  const start = parseDateInput(startDate);
  const end = parseDateInput(endDate);

  if (!start || !end) {
    return { hours: 0, minutes: 0, totalMinutes: 0, formatted: '0m' };
  }

  const totalMinutes = Math.max(0, end.diff(start, 'minute'));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return {
    hours,
    minutes,
    totalMinutes,
    formatted: formatDuration(totalMinutes),
  };
};

// RELATIVE TIME
export const getRelativeTime = (date: string | null): string => {
  const parsed = parseDateInput(date);
  return parsed ? parsed.fromNow() : '';
};

// DATE RANGE
export const getDateRange = (
  startDate: string | null,
  endDate: string | null,
): string[] => {
  const start = parseDateInput(startDate);
  const end = parseDateInput(endDate);

  if (!start || !end || start.isAfter(end, 'day')) return [];

  const dates: string[] = [];
  let current = start.startOf('day');

  while (current.isSameOrBefore(end, 'day')) {
    dates.push(current.format(DATE_ONLY_FORMAT));
    current = current.add(1, 'day');
  }

  return dates;
};

// MONTH UTILITIES
export const getMonthIndex = (date: string | null): number => {
  return getValidDate(date).month();
};

export const getYear = (date: string | null): number => {
  return getValidDate(date).year();
};

export const getDayOfWeek = (date: string | null): number => {
  return getValidDate(date).day();
};

export const getLocalizedWeeks = (): number => {
  const yearStart = dayjs().startOf('year');
  const yearEnd = dayjs().endOf('year');
  return yearEnd.diff(yearStart, 'week') + 1;
};

// PICKER UTILITIES
export const normalizeTimeValue = (value?: string | null): string => {
  const parsed = parseDateInput(value);
  if (!parsed) return FALLBACK_TIME;
  return parsed.format(TIME_ONLY_FORMAT);
};

export const toTimeDate = (value?: string | null): Date => {
  const normalized = normalizeTimeValue(value);
  const parsed = dayjs(normalized, TIME_ONLY_FORMAT, true);

  if (!parsed.isValid()) return new Date();

  return dayjs()
    .hour(parsed.hour())
    .minute(parsed.minute())
    .second(0)
    .millisecond(0)
    .toDate();
};

export const fromTimeDate = (value: Date): string => {
  return dayjs(value).format(TIME_ONLY_FORMAT);
};

export const normalizeDateValue = (value?: string | null): string => {
  const parsed = parseDateInput(value);
  return (parsed ?? dayjs()).format(DATE_ONLY_FORMAT);
};

export const toDateOnly = (value?: string | null): Date => {
  return dayjs(normalizeDateValue(value), DATE_ONLY_FORMAT, true).toDate();
};

export const fromDateOnly = (value: Date): string => {
  return dayjs(value).format(DATE_ONLY_FORMAT);
};

export const formatPickerDate = (value?: string | null): string => {
  return dayjs(normalizeDateValue(value)).format(DISPLAY_DATE_FORMAT);
};

export const formatPickerTime = (value?: string | null): string => {
  return dayjs(normalizeTimeValue(value), TIME_ONLY_FORMAT, true).format(
    DISPLAY_TIME_FORMAT,
  );
};

export const toISODateTime = (value?: string | null): string => {
  return getValidDate(value).format(ISO_DATE_TIME_FORMAT);
};
