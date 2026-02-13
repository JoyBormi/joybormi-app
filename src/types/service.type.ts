export enum ServiceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

export enum ServiceOwnerType {
  CREATOR = 'CREATOR',
  WORKER = 'WORKER',
}

export interface IService {
  id: string;
  brandId: string;
  name: string;
  description?: string;
  durationMins: number;
  price: number;
  currency: string;
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

export interface CreateServicePayload {
  name: string;
  description?: string;
  durationMins: number;
  price: number;
}

export interface UpdateServicePayload {
  name?: string;
  description?: string;
  durationMins?: number;
  price?: number;
  status?: ServiceStatus;
  currency?: string;
}
