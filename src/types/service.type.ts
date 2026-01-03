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
  description: string | null;
  durationMins: number;
  price: number;
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  ownerType: ServiceOwnerType;
}

export interface CreateServicePayload {
  name: string;
  description?: string | null;
  durationMins: number;
  price: number;
  ownerType: ServiceOwnerType;
}

export interface UpdateServicePayload {
  name?: string;
  description?: string | null;
  durationMins?: number;
  price?: number;
  status?: ServiceStatus;
}
