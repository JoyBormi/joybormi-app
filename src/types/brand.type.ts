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

export interface IWorkingHours {
  day: string;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
}

export interface IBrandService {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  currency: string;
  category: string;
  image?: string;
  popular: boolean;
  discount?: {
    percentage: number;
    validUntil: string;
  };
}

export interface IBrandWorker {
  id: string;
  name: string;
  avatar: string;
  role: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  yearsOfExperience: number;
  bio?: string;
  isAvailable: boolean;
}

export interface IBrandPhoto {
  id: string;
  url: string;
  category: 'interior' | 'exterior' | 'service' | 'team' | 'other';
  uploadedAt: string;
  caption?: string;
}

export interface IBrandReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  images?: string[];
  serviceId?: string;
  serviceName?: string;
  helpful: number;
}

export interface IBrandBooking {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  workerId?: string;
  workerName?: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  currency: string;
}

export type BrandTabType =
  | 'home'
  | 'services'
  | 'workers'
  | 'photos'
  | 'reviews'
  | 'about'
  | 'bookings';
