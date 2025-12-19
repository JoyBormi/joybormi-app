import dayjs, { extend } from 'dayjs';
import isSameOrAfterPlugin from 'dayjs/plugin/isSameOrAfter';
import isSameOrBeforePlugin from 'dayjs/plugin/isSameOrBefore';
import isTodayPlugin from 'dayjs/plugin/isToday';
import isTomorrowPlugin from 'dayjs/plugin/isTomorrow';
import relativeTimePlugin from 'dayjs/plugin/relativeTime';

// Extend dayjs with plugins
extend(isSameOrAfterPlugin);
extend(isSameOrBeforePlugin);
extend(isTodayPlugin);
extend(isTomorrowPlugin);
extend(relativeTimePlugin);

// VALIDATION
export const isValidDate = (date: string | null | undefined): boolean => {
  if (!date || typeof date !== 'string') return false;
  return dayjs(date).isValid();
};

// DATE FORMATTING
export const formatDate = (
  date: string | null,
  format: string = 'YYYY-MM-DD',
): string => {
  if (!isValidDate(date)) return dayjs().format(format);
  return dayjs(date).format(format);
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
  if (!isValidDate(date)) return false;
  return dayjs(date).isToday();
};

export const isTomorrow = (date: string | null): boolean => {
  if (!isValidDate(date)) return false;
  return dayjs(date).isTomorrow();
};

export const isPast = (date: string | null): boolean => {
  if (!isValidDate(date)) return false;
  return dayjs(date).isBefore(dayjs(), 'day');
};

export const isFuture = (date: string | null): boolean => {
  if (!isValidDate(date)) return false;
  return dayjs(date).isAfter(dayjs(), 'day');
};

export const isSameDay = (
  date1: string | null,
  date2: string | null,
): boolean => {
  if (!isValidDate(date1) || !isValidDate(date2)) return false;
  return dayjs(date1).isSame(dayjs(date2), 'day');
};

// DATE MANIPULATION
export const addDays = (date: string | null, days: number): string => {
  if (!isValidDate(date)) return dayjs().add(days, 'day').format('YYYY-MM-DD');
  return dayjs(date).add(days, 'day').format('YYYY-MM-DD');
};

export const subtractDays = (date: string | null, days: number): string => {
  if (!isValidDate(date))
    return dayjs().subtract(days, 'day').format('YYYY-MM-DD');
  return dayjs(date).subtract(days, 'day').format('YYYY-MM-DD');
};

export const startOfDay = (date: string | null): string => {
  if (!isValidDate(date)) return dayjs().startOf('day').toISOString();
  return dayjs(date).startOf('day').toISOString();
};

export const endOfDay = (date: string | null): string => {
  if (!isValidDate(date)) return dayjs().endOf('day').toISOString();
  return dayjs(date).endOf('day').toISOString();
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
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return { hours: 0, minutes: 0, totalMinutes: 0, formatted: '0m' };
  }

  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const totalMinutes = end.diff(start, 'minute');
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  let formatted = '';
  if (hours > 0 && minutes > 0) {
    formatted = `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    formatted = `${hours}h`;
  } else {
    formatted = `${minutes}m`;
  }

  return { hours, minutes, totalMinutes, formatted };
};

// RELATIVE TIME
export const getRelativeTime = (date: string | null): string => {
  if (!isValidDate(date)) return '';
  return dayjs(date).fromNow();
};

// DATE RANGE
export const getDateRange = (
  startDate: string | null,
  endDate: string | null,
): string[] => {
  if (!isValidDate(startDate) || !isValidDate(endDate)) return [];

  const dates: string[] = [];
  let current = dayjs(startDate);
  const end = dayjs(endDate);

  while (current.isSameOrBefore(end, 'day')) {
    dates.push(current.format('YYYY-MM-DD'));
    current = current.add(1, 'day');
  }

  return dates;
};

// MONTH UTILITIES
export const getMonthIndex = (date: string | null): number => {
  if (!isValidDate(date)) return dayjs().month();
  return dayjs(date).month();
};

export const getYear = (date: string | null): number => {
  if (!isValidDate(date)) return dayjs().year();
  return dayjs(date).year();
};

export const getDayOfWeek = (date: string | null): number => {
  if (!isValidDate(date)) return dayjs().day();
  return dayjs(date).day();
};

export const getLocalizedWeeks = (): number => {
  return new Date().getFullYear();
};
