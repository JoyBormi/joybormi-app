export type ReservationStatus =
  | 'confirmed'
  | 'pending'
  | 'cancelled'
  | 'rejected'
  | 'completed';

export interface Reservation {
  id: string;
  name: string;
  service: string;
  summary: string;
  start: string;
  end: string;
  avatar: string;
  status: ReservationStatus;
  type: string;
}

export interface ReservationSection {
  title: string;
  date: string;
  data: Reservation[];
}

export interface ReservationFilters {
  dateRange: {
    start: string;
    end: string;
  };
  statuses: ReservationStatus[];
  types: string[];
}
