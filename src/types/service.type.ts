export enum ServiceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

export enum ServiceOwnerType {
  BRAND = 'BRAND',
  WORKER = 'WORKER',
}

export interface IService {
  id: string;
  brandId: string;
  name: string;
  description?: string;
  durationMins: number;
  price: number;
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  ownerType: ServiceOwnerType;
}

export interface CreateServicePayload {
  brandId: string;
  name: string;
  description?: string;
  durationMins: number;
  price: number;
  status?: ServiceStatus;
  ownerId: string;
  ownerType: string;
}

export interface UpdateServicePayload {
  name?: string;
  description?: string;
  durationMins?: number;
  price?: number;
  status?: ServiceStatus;
}
