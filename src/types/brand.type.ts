import { Major } from '@/constants/enum';

export interface IBrand {
  id: string;
  creatorId: string;
  brandName: string;
  businessName: string;
  businessNumber: string;
  verifiedAt: Date | null;
  status: BrandStatus;
  country: string;
  state: string;
  city: string;
  street: string;
  detailedAddress: string;
  postalCode: string;
  profileImage: string | null;
  bannerImage: string | null;
  description: string | null;
  email: string | null;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  businessCategory: Major;
  businessCertUrl: string;
  ownerFirstName: string;
  ownerLastName: string;
}

export enum BrandStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export type BrandTabType =
  | 'home'
  | 'services'
  | 'workers'
  | 'photos'
  | 'reviews'
  | 'about'
  | 'bookings';
