import { IBrand, IBrandService, IBrandWorker } from './brand.type';
import { IUser } from './user.type';

export enum ReservationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
}

export interface IReservation {
  id: string;
  customerId: string;
  brandId: string;
  serviceId: string;
  workerId: string;
  title?: string;
  summary?: string;
  startTime: string | Date;
  endTime: string | Date;
  status: ReservationStatus;
  color?: string;
  image?: string;
  createdAt: string | Date;
  updatedAt: string | Date;

  brand?: IBrand;
  customer?: IUser;
  service?: IBrandService;
  worker?: IBrandWorker;
}

export interface CreateReservationPayload {
  brandId: string;
  serviceId: string;
  workerId: string;
  startTime: string;
  endTime: string;
  note?: string;
}
