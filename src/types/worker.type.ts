/**
 * Worker Profile Types
 */

export type WorkerStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export interface IWorker {
  id: string;
  userId: string;
  brandId: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  coverImage: string | null;
  bio: string | null;
  jobTitle: string | null;
  languages: string[];
  instagram: string | null;
  isPublic: boolean;
  status: WorkerStatus;
  scheduleId: string | null;
  createdAt: string;
  updatedAt: string;
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
