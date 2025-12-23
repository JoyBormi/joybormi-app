import type { Review, Service, Worker, WorkingDay } from '../worker-profile.d';

/**
 * Mock data for Worker Profile
 */

export const getMockWorker = (
  userId?: string,
  firstName?: string,
  lastName?: string,
): Worker => ({
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

export const getMockServices = (): Service[] => [
  {
    id: 'service-1',
    name: 'Hair Coloring',
    description: 'Professional hair coloring with premium products',
    duration_mins: 120,
    price: '$150',
  },
  {
    id: 'service-2',
    name: 'Haircut & Style',
    description: 'Modern haircut with styling',
    duration_mins: 60,
    price: '$80',
  },
  {
    id: 'service-3',
    name: 'Balayage Treatment',
    description: 'Natural-looking highlights with balayage technique',
    duration_mins: 180,
    price: '$200',
  },
];

export const getMockWorkingDays = (): WorkingDay[] => [
  {
    id: 'wd-1',
    day_of_week: 1,
    start_time: '09:00:00',
    end_time: '17:00:00',
    breaks: [{ id: 'b-1', start_time: '12:00:00', end_time: '13:00:00' }],
  },
  {
    id: 'wd-2',
    day_of_week: 2,
    start_time: '09:00:00',
    end_time: '17:00:00',
    breaks: [{ id: 'b-2', start_time: '12:00:00', end_time: '13:00:00' }],
  },
  {
    id: 'wd-3',
    day_of_week: 3,
    start_time: '09:00:00',
    end_time: '17:00:00',
    breaks: [{ id: 'b-3', start_time: '12:00:00', end_time: '13:00:00' }],
  },
  {
    id: 'wd-4',
    day_of_week: 4,
    start_time: '09:00:00',
    end_time: '17:00:00',
    breaks: [{ id: 'b-4', start_time: '12:00:00', end_time: '13:00:00' }],
  },
  {
    id: 'wd-5',
    day_of_week: 5,
    start_time: '09:00:00',
    end_time: '17:00:00',
    breaks: [{ id: 'b-5', start_time: '12:00:00', end_time: '13:00:00' }],
  },
];

export const getMockReviews = (): Review[] => [
  {
    id: 'review-1',
    customer_name: 'Emily Davis',
    customer_avatar: 'https://i.pravatar.cc/150?img=10',
    rating: 5,
    comment: 'Amazing service! Sarah is very professional and talented.',
    created_at: '2024-01-15T10:30:00Z',
    service_name: 'Hair Coloring',
  },
  {
    id: 'review-2',
    customer_name: 'Michael Brown',
    customer_avatar: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    comment: 'Best haircut I have ever had. Highly recommend!',
    created_at: '2024-01-10T14:20:00Z',
    service_name: 'Haircut & Style',
  },
  {
    id: 'review-3',
    customer_name: 'Jessica Wilson',
    customer_avatar: 'https://i.pravatar.cc/150?img=15',
    rating: 4,
    comment: 'Great experience overall. Will definitely come back!',
    created_at: '2024-01-05T16:45:00Z',
    service_name: 'Balayage Treatment',
  },
];
