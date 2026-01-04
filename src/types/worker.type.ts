/**
 * Worker Profile Types
 */

export interface IWorker {
  id: string;
  userId: string;
  brandId: string;
  name: string;
  role: string;
  avatar: string;
  coverImage?: string;
  bio: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  status: 'active' | 'inactive' | 'pending';
  email: string;
  phone: string;
}
