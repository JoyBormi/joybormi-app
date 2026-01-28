import dayjs from 'dayjs';

import Icons from '@/components/icons';

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

export const STATUS_STYLES: Record<
  string,
  {
    bgColor: string;
    textColor: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  approved: {
    bgColor: 'bg-success/20 dark:bg-success/20',
    textColor: 'text-success',
    icon: Icons.CheckCircle,
  },
  pending: {
    bgColor: 'bg-warning/20 dark:bg-warning/20',
    textColor: 'text-warning',
    icon: Icons.Clock,
  },
  cancelled: {
    bgColor: 'bg-muted/50',
    textColor: 'text-muted-foreground',
    icon: Icons.X,
  },
  completed: {
    bgColor: 'bg-success/20 dark:bg-success/20',
    textColor: 'text-success',
    icon: Icons.CheckCircle,
  },
  rejected: {
    bgColor: 'bg-destructive/20 dark:bg-destructive/20',
    textColor: 'text-destructive',
    icon: Icons.X,
  },
  confirmed: {
    bgColor: 'bg-primary/20 dark:bg-primary/20',
    textColor: 'text-primary',
    icon: Icons.CheckCircle,
  },
};

export const getStatusConfig = (
  status: ReservationStatus,
): {
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
  textColor: string;
  label: string;
} => {
  switch (status) {
    case 'approved':
      return {
        icon: Icons.CheckCircle,
        bgColor: 'bg-success/10 dark:bg-success/20',
        textColor: 'text-success',
        label: 'Approved',
      };
    case 'pending':
      return {
        icon: Icons.Clock,
        bgColor: 'bg-warning/10 dark:bg-warning/20',
        textColor: 'text-warning',
        label: 'Pending',
      };
    case 'rejected':
      return {
        icon: Icons.X,
        bgColor: 'bg-destructive/10 dark:bg-destructive/20',
        textColor: 'text-destructive',
        label: 'Rejected',
      };
    case 'cancelled':
      return {
        icon: Icons.X,
        bgColor: 'bg-muted/50',
        textColor: 'text-muted-foreground',
        label: 'Cancelled',
      };
    case 'confirmed':
      return {
        icon: Icons.CheckCircle,
        bgColor: 'bg-primary/10 dark:bg-primary/20',
        textColor: 'text-primary',
        label: 'Confirmed',
      };
    case 'completed':
      return {
        icon: Icons.CheckCircle,
        bgColor: 'bg-success/10 dark:bg-success/20',
        textColor: 'text-success',
        label: 'Completed',
      };
  }
};

export const fetchReservations = async (
  page: number,
  filters: ReservationFilters,
): Promise<Reservation[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 150));

  const reservations: Reservation[] = [];
  const pageSize = 15;
  const startOffset = page * pageSize;

  for (let i = 0; i < pageSize; i++) {
    const id = Math.random().toString(36).substring(2, 9);
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

    const color = STATUS_STYLES[status].bgColor;

    // Apply filters (simulated)
    if (filters.statuses.length > 0 && !filters.statuses.includes(status))
      continue;
    if (filters.types.length > 0 && !filters.types.includes(type)) continue;

    reservations.push({
      uuid: id,
      title: NAMES[Math.floor(Math.random() * NAMES.length)],
      start_time: date
        .hour(9 + (i % 8))
        .minute(0)
        .format('YYYY-MM-DD HH:mm:ss'),
      end_time: date
        .hour(10 + (i % 8))
        .minute(0)
        .format('YYYY-MM-DD HH:mm:ss'),
      avatar: `https://i.pravatar.cc/150?u=${id}`,
      status,
      summary: `Reservation for ${type} with ${NAMES[Math.floor(Math.random() * NAMES.length)]} on ${date.format('YYYY-MM-DD')} at ${date.format('h:mm A')} - ${date.format('h:mm A')} in ${NAMES[Math.floor(Math.random() * NAMES.length)]}`,
      brand_name: 'Brand Name',
      service: 'Haircut',
      worker_name: 'Worker Name',
      color,
    });
  }

  return reservations;
};
