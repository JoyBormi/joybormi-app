export type ReservationStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'confirmed'
  | 'completed';

export interface Reservation {
  uuid: string;
  title: string;
  summary: string;
  start_time: string;
  end_time: string;
  status: ReservationStatus;
  color: string;
  brand_name: string;
  service: string;
  worker_name: string;
  avatar?: string;
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
