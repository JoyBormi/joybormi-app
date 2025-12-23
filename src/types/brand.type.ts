export interface IBrand {
  id: string;
  name: string;
  description: string;
  category: string;
  logo: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  location: {
    address: string;
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  workingHours: IWorkingHours[];
  isOpen: boolean;
  nextOpenTime?: string;
  verified: boolean;
  tags: string[];
  priceRange: 'budget' | 'moderate' | 'premium' | 'luxury';
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
