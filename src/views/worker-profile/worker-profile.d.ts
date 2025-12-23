/**
 * Type definitions for Worker Profile view
 */

export interface Worker {
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

export interface Service {
  id: string;
  name: string;
  description: string;
  duration_mins: number;
  price: string;
}

export interface WorkingDay {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  breaks: WorkingDayBreak[];
}

export interface WorkingDayBreak {
  id: string;
  start_time: string;
  end_time: string;
}

export interface Review {
  id: string;
  customer_name: string;
  customer_avatar: string;
  rating: number;
  comment: string;
  created_at: string;
  service_name: string;
}

export interface WorkerProfileFormData {
  name: string;
  role: string;
  bio: string;
  specialties: string[];
  email: string;
  phone: string;
  avatar?: string;
  coverImage?: string;
}

export interface ServiceFormData {
  name: string;
  description: string;
  duration_mins: number;
  price: string;
}

export interface ScheduleFormData {
  workingDays: {
    day_of_week: number;
    start_time: string;
    end_time: string;
    breaks: {
      start_time: string;
      end_time: string;
    }[];
  }[];
}
