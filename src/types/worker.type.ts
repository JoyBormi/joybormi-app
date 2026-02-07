/**
 * Worker Profile Types
 */

export type WorkerStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export interface IWorker {
  id: string;
  userId: string;
  brandId: string;
  username: string;
  jobTitle: string;
  avatar: string;
  coverImage?: string;
  bio: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  status: WorkerStatus;
  email: string;
  phone: string;
}

export interface IReview {
  id: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  serviceName?: string;
}
