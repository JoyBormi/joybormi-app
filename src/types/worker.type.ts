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

export interface IService {
  id: string;
  creatorId: string;
  brandId: string;
  name: string;
  description: string;
  durationMins: number;
  price: string;
  createdAt: string;
}

export interface IWorkingDay {
  id: string;
  scheduleId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export interface IWorkingDayBreak {
  id: string;
  workingDayId: string;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export interface IReview {
  id: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  serviceName: string;
}

export interface IWorkerProfileFormData {
  name: string;
  role: string;
  bio: string;
  specialties: string[];
  email: string;
  phone: string;
  avatar?: string;
  coverImage?: string;
}

export interface IServiceFormData {
  name: string;
  description: string;
  durationMins: number;
  price: string;
}

export interface IScheduleFormData {
  workingDays: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    breaks: {
      startTime: string;
      endTime: string;
    }[];
  }[];
}
