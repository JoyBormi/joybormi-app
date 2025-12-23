import type {
  IReview,
  IService,
  IWorker,
  IWorkingDay,
} from '@/types/worker.type';
import { z } from 'zod';

/**
 * Validation schemas for Worker Profile forms
 */

export const workerProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.string().min(2, 'Role must be at least 2 characters'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  specialties: z.array(z.string()).min(1, 'At least one specialty is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  avatar: z.string().optional(),
  coverImage: z.string().optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(2, 'Service name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  durationMins: z.number().min(15, 'Duration must be at least 15 minutes'),
  price: z.string().min(1, 'Price is required'),
});

export type WorkerProfileFormData = z.infer<typeof workerProfileSchema>;
export type ServiceFormData = z.infer<typeof serviceSchema>;

/**
 * Mock data generators
 */

export const getMockWorker = (
  userId?: string,
  firstName?: string,
  lastName?: string,
): IWorker => ({
  id: userId || 'worker-123',
  userId: userId || 'worker-123',
  brandId: 'brand-123',
  name: firstName && lastName ? `${firstName} ${lastName}` : 'Sarah Johnson',
  role: 'Senior Stylist',
  avatar: 'https://i.pravatar.cc/150?img=5',
  coverImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035',
  bio: 'Passionate hair stylist with 8+ years of experience in color treatments and modern cuts.',
  specialties: ['Hair Coloring', 'Balayage', 'Haircuts', 'Styling'],
  rating: 4.9,
  reviewCount: 127,
  status: 'active',
  email: 'sarah.j@example.com',
  phone: '+1 (555) 123-4567',
});

export const getMockServices = (): IService[] => [
  {
    id: 'service-1',
    creatorId: 'worker-123',
    brandId: 'brand-123',
    name: 'Hair Coloring',
    description: 'Professional hair coloring with premium products',
    durationMins: 120,
    price: '$150',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'service-2',
    creatorId: 'worker-123',
    brandId: 'brand-123',
    name: 'Haircut & Style',
    description: 'Modern haircut with styling',
    durationMins: 60,
    price: '$80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'service-3',
    creatorId: 'worker-123',
    brandId: 'brand-123',
    name: 'Balayage Treatment',
    description: 'Natural-looking highlights with balayage technique',
    durationMins: 180,
    price: '$200',
    createdAt: new Date().toISOString(),
  },
];

export const getMockWorkingDays = (): IWorkingDay[] => [
  {
    id: 'wd-1',
    scheduleId: 'schedule-123',
    dayOfWeek: 1,
    startTime: '09:00:00',
    endTime: '17:00:00',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'wd-2',
    scheduleId: 'schedule-123',
    dayOfWeek: 2,
    startTime: '09:00:00',
    endTime: '17:00:00',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'wd-3',
    scheduleId: 'schedule-123',
    dayOfWeek: 3,
    startTime: '09:00:00',
    endTime: '17:00:00',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'wd-4',
    scheduleId: 'schedule-123',
    dayOfWeek: 4,
    startTime: '09:00:00',
    endTime: '17:00:00',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'wd-5',
    scheduleId: 'schedule-123',
    dayOfWeek: 5,
    startTime: '09:00:00',
    endTime: '17:00:00',
    createdAt: new Date().toISOString(),
  },
];

export const getMockReviews = (): IReview[] => [
  {
    id: 'review-1',
    customerName: 'Emily Davis',
    customerAvatar: 'https://i.pravatar.cc/150?img=10',
    rating: 5,
    comment: 'Amazing service! Sarah is very professional and talented.',
    createdAt: '2024-01-15T10:30:00Z',
    serviceName: 'Hair Coloring',
  },
  {
    id: 'review-2',
    customerName: 'Michael Brown',
    customerAvatar: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    comment: 'Best haircut I have ever had. Highly recommend!',
    createdAt: '2024-01-10T14:20:00Z',
    serviceName: 'Haircut & Style',
  },
  {
    id: 'review-3',
    customerName: 'Jessica Wilson',
    customerAvatar: 'https://i.pravatar.cc/150?img=15',
    rating: 4,
    comment: 'Great experience overall. Will definitely come back!',
    createdAt: '2024-01-05T16:45:00Z',
    serviceName: 'Balayage Treatment',
  },
];
