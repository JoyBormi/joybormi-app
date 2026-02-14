import { SearchService } from '@/hooks/search';
import { isValidDate, normalizeTimeValue } from '@/utils/date';

type WorkingHourSlot = {
  dayOfWeek?: unknown;
  startTime?: unknown;
  endTime?: unknown;
};

const dayNameToIndex = (value: unknown) => {
  if (typeof value === 'number' && Number.isInteger(value)) {
    return value >= 0 && value <= 6 ? value : -1;
  }

  if (typeof value !== 'string') return -1;

  const normalized = value.trim().toLowerCase();
  if (!normalized) return -1;

  const asNumber = Number(normalized);
  if (Number.isInteger(asNumber) && asNumber >= 0 && asNumber <= 6) {
    return asNumber;
  }

  if (normalized.startsWith('sun')) return 0;
  if (normalized.startsWith('mon')) return 1;
  if (normalized.startsWith('tue')) return 2;
  if (normalized.startsWith('wed')) return 3;
  if (normalized.startsWith('thu')) return 4;
  if (normalized.startsWith('fri')) return 5;
  if (normalized.startsWith('sat')) return 6;
  return -1;
};

const toLocaleDayIndex = (dayIndex: number) => (dayIndex + 6) % 7;

const timeToMinutes = (value: unknown) => {
  if (typeof value !== 'string') return null;
  if (!isValidDate(value)) return null;

  const [rawHours, rawMinutes] = normalizeTimeValue(value).split(':');
  const h = Number(rawHours);
  const m = Number(rawMinutes);

  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;

  return h * 60 + m;
};

const getFirstValidSlot = (service: SearchService): WorkingHourSlot | null => {
  const slots = Array.isArray(service.workerWorkingHours)
    ? (service.workerWorkingHours as WorkingHourSlot[])
    : [];

  return (
    slots.find((slot) => {
      return Boolean(
        slot &&
          dayNameToIndex(slot.dayOfWeek) >= 0 &&
          timeToMinutes(slot.startTime) !== null &&
          timeToMinutes(slot.endTime) !== null,
      );
    }) || null
  );
};

export const formatWorkingHours = (
  service: SearchService,
  getDayNameShort: (index: number) => string,
) => {
  const firstSlot = getFirstValidSlot(service);
  if (!firstSlot) return null;

  const dayIndex = dayNameToIndex(firstSlot.dayOfWeek);
  if (dayIndex < 0) return null;

  const dayLabel = getDayNameShort(toLocaleDayIndex(dayIndex));
  const start = normalizeTimeValue(String(firstSlot.startTime));
  const end = normalizeTimeValue(String(firstSlot.endTime));

  return `${dayLabel} ${start}-${end}`;
};

export const isWorkerAvailableNow = (service: SearchService) => {
  const schedule = Array.isArray(service.workerWorkingHours)
    ? service.workerWorkingHours
    : [];
  if (schedule.length === 0) return false;

  const now = new Date();
  const today = now.getDay();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return schedule.some((slot) => {
    if (!slot) return false;

    const day = dayNameToIndex(slot.dayOfWeek);
    if (day !== today) return false;

    const start = timeToMinutes(slot.startTime);
    const end = timeToMinutes(slot.endTime);
    if (start === null || end === null) return false;

    if (end < start) {
      return nowMinutes >= start || nowMinutes <= end;
    }

    return nowMinutes >= start && nowMinutes <= end;
  });
};

