import dayjs from 'dayjs';
import { Reservation, ReservationFilters, ReservationStatus } from './types';

const SERVICES = [
  'Haircut',
  'Coloring',
  'Styling',
  'Treatment',
  'Consultation',
];
const NAMES = [
  'Dorothy Jenkins',
  'Cynthia Pierce',
  'Alice Hicks',
  'Nicole Bell',
  'Sarah Connor',
  'John Doe',
  'Jane Smith',
  'Michael Scott',
];

export const fetchReservations = async (
  page: number,
  filters: ReservationFilters,
): Promise<Reservation[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const reservations: Reservation[] = [];
  const pageSize = 15;
  const startOffset = page * pageSize;

  for (let i = 0; i < pageSize; i++) {
    const id = `res-${startOffset + i}`;
    const date = dayjs(filters.dateRange.start).add(
      Math.floor((startOffset + i) / 3),
      'day',
    );

    // Stop if we exceed the end date
    if (date.isAfter(dayjs(filters.dateRange.end))) break;

    const status: ReservationStatus = (
      ['confirmed', 'pending', 'cancelled'] as const
    )[Math.floor(Math.random() * 3)];
    const type = SERVICES[Math.floor(Math.random() * SERVICES.length)];

    // Apply filters (simulated)
    if (filters.statuses.length > 0 && !filters.statuses.includes(status))
      continue;
    if (filters.types.length > 0 && !filters.types.includes(type)) continue;

    reservations.push({
      id,
      name: NAMES[Math.floor(Math.random() * NAMES.length)],
      service: type,
      start: date
        .hour(9 + (i % 8))
        .minute(0)
        .format('YYYY-MM-DD HH:mm:ss'),
      end: date
        .hour(10 + (i % 8))
        .minute(0)
        .format('YYYY-MM-DD HH:mm:ss'),
      avatar: `https://i.pravatar.cc/150?u=${id}`,
      status,
      summary: `Reservation for ${type} with ${NAMES[Math.floor(Math.random() * NAMES.length)]} on ${date.format('YYYY-MM-DD')} at ${date.format('h:mm A')} - ${date.format('h:mm A')} in ${NAMES[Math.floor(Math.random() * NAMES.length)]}`,
      type,
    });
  }

  return reservations;
};
