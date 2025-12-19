import { Major } from '@/constants/enum';
import { CategoryFilters } from './category-filter';
import { MotiView } from 'moti';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { ServiceCard } from './service-card';

// Dummy service data - will be replaced with TanStack Query
const DUMMY_SERVICES = [
  {
    id: '1',
    name: 'Premium Haircut & Styling',
    provider: 'Elite Barber Shop',
    category: Major.Barber,
    priceRange: { min: 35, max: 65 },
    durationRange: { min: 45, max: 90 },
    rating: 4.8,
    reviewCount: 342,
    distance: 1.2,
    images: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800',
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800',
      'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800',
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800',
    ],
    hashtags: ['haircut', 'styling', 'beard'],
  },
  {
    id: '2',
    name: 'Relaxing Spa Treatment',
    provider: 'Serenity Spa & Wellness',
    category: Major.Spa,
    priceRange: { min: 80, max: 180 },
    durationRange: { min: 60, max: 120 },
    rating: 4.9,
    reviewCount: 567,
    distance: 2.5,
    images: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800',
    ],
    hashtags: ['spa', 'massage', 'relaxation'],
  },
  {
    id: '3',
    name: 'Dental Cleaning & Checkup',
    provider: 'Bright Smile Dental Clinic',
    category: Major.Dentist,
    priceRange: { min: 60, max: 120 },
    durationRange: { min: 30, max: 60 },
    rating: 4.7,
    reviewCount: 234,
    distance: 0.8,
    images: [
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800',
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800',
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800',
    ],
    hashtags: ['dental', 'cleaning', 'checkup'],
  },
  {
    id: '4',
    name: 'Personal Training Session',
    provider: 'FitLife Gym & Fitness',
    category: Major.PersonalTrainer,
    priceRange: { min: 50, max: 100 },
    durationRange: { min: 45, max: 90 },
    rating: 4.9,
    reviewCount: 891,
    distance: 1.5,
    images: [
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800',
    ],
    hashtags: ['fitness', 'training', 'gym'],
  },
  {
    id: '5',
    name: 'Yoga & Meditation',
    provider: 'Zen Wellness Studio',
    category: Major.YogaInstructor,
    priceRange: { min: 25, max: 50 },
    durationRange: { min: 60, max: 90 },
    rating: 4.8,
    reviewCount: 456,
    distance: 3.2,
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
      'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800',
    ],
    hashtags: ['yoga', 'meditation', 'wellness'],
  },
  {
    id: '6',
    name: 'Custom Tattoo Design',
    provider: 'Ink Masters Studio',
    category: Major.TattooArtist,
    priceRange: { min: 150, max: 500 },
    durationRange: { min: 120, max: 300 },
    rating: 5.0,
    reviewCount: 178,
    distance: 4.1,
    images: [
      'https://images.unsplash.com/photo-1590246814883-57c511a8c416?w=800',
      'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=800',
      'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=800',
      'https://images.unsplash.com/photo-1565058379802-bbe93b2f703f?w=800',
    ],
    hashtags: ['tattoo', 'art', 'custom'],
  },
  {
    id: '7',
    name: 'General Health Consultation',
    provider: 'HealthCare Plus Medical Center',
    category: Major.GeneralDoctor,
    priceRange: { min: 80, max: 150 },
    durationRange: { min: 20, max: 45 },
    rating: 4.6,
    reviewCount: 623,
    distance: 2.1,
    images: [
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800',
      'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800',
      'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=800',
    ],
    hashtags: ['doctor', 'health', 'consultation'],
  },
  {
    id: '8',
    name: 'Hair Coloring & Treatment',
    provider: 'Glamour Hair Salon',
    category: Major.HairSalon,
    priceRange: { min: 100, max: 250 },
    durationRange: { min: 90, max: 180 },
    rating: 4.9,
    reviewCount: 789,
    distance: 1.8,
    images: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800',
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800',
    ],
    hashtags: ['haircolor', 'salon', 'treatment'],
  },
];

interface ServiceGridProps {
  category: string;
  searchQuery?: string;
  filters?: CategoryFilters;
}

export function ServiceGrid({
  category,
  searchQuery,
  filters,
}: ServiceGridProps) {
  const { t } = useTranslation();
  const [isLoading] = useState(false);

  // Filter services based on category and search query
  // In the future, this will be replaced with TanStack Query
  let filteredServices =
    category === 'all'
      ? DUMMY_SERVICES
      : DUMMY_SERVICES.filter((service) => service.category === category);

  // Apply search filter if query exists
  if (searchQuery && searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase();
    filteredServices = filteredServices.filter(
      (service) =>
        service.name.toLowerCase().includes(query) ||
        service.provider.toLowerCase().includes(query) ||
        service.hashtags.some((tag) => tag.toLowerCase().includes(query)),
    );
  }

  // Apply filters if they exist
  if (filters) {
    // Filter by rating
    if (filters.rating.length > 0) {
      const minRating = Math.min(...filters.rating);
      filteredServices = filteredServices.filter(
        (service) => service.rating >= minRating,
      );
    }

    // Filter by distance
    filteredServices = filteredServices.filter(
      (service) => service.distance <= filters.distance,
    );

    // Sort by selected option
    filteredServices = [...filteredServices].sort((a, b) => {
      switch (filters.sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.priceRange.min - b.priceRange.min;
        default:
          return 0;
      }
    });
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <Text className="font-body text-muted-foreground">
          {t('common.labels.loading')}
        </Text>
      </View>
    );
  }

  if (filteredServices.length === 0) {
    return (
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 300 }}
        className="flex-1 items-center justify-center py-20 px-4"
      >
        <Text className="text-4xl mb-4">🔍</Text>
        <Text className="font-title text-foreground mb-2">
          {t('categories.noServices')}
        </Text>
        <Text className="font-body text-muted-foreground text-center">
          {t('categories.noServicesDescription')}
        </Text>
      </MotiView>
    );
  }

  return (
    <View className="px-4 py-4">
      {/* Service List - Vertical */}
      <View className="py-6">
        {filteredServices.map((service, index) => (
          <ServiceCard key={service.id} service={service} index={index} />
        ))}
      </View>
    </View>
  );
}
