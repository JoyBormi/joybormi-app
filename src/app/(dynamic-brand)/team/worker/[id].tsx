import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import Icons from '@/components/icons';
import { Button, Text } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MemberAboutTab,
  MemberReviewsTab,
  MemberScheduleTab,
  MemberServicesTab,
} from '@/views/worker';

type WorkerTabType = 'about' | 'services' | 'schedule' | 'reviews';

/**
 * Dynamic Member Profile Page - Public view for team members
 * Route: /(dynamic-brand)/team/member/[id]
 * - Read-only showcase of member profile
 * - Clients can view and book services
 * - No edit capabilities (use member-profile for editing)
 */
const WorkerDetailScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<WorkerTabType>('about');

  // This is a public view - no edit capabilities
  const isOwner = false;

  // Mock worker data - In production, fetch from API based on id param
  const worker = {
    id,
    userId: id,
    brandId: 'brand-123',
    name: 'Sarah Johnson',
    role: 'Senior Stylist',
    avatar: 'https://i.pravatar.cc/150?img=5',
    coverImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035',
    bio: 'Passionate hair stylist with 8+ years of experience in color treatments and modern cuts.',
    specialties: ['Hair Coloring', 'Balayage', 'Haircuts', 'Styling'],
    rating: 4.9,
    reviewCount: 127,
    status: 'active' as const,
  };

  // Mock services data
  const services = [
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
  ];

  // Mock schedule data
  const workingDays = [
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

  // Mock reviews data
  const reviews = [
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
  ];

  const handleBack = () => {
    router.back();
  };

  const handleBooking = () => {
    console.log('Book with worker:', id);
    // Navigate to booking page with this worker pre-selected
  };

  const handleServicePress = (service: (typeof services)[0]) => {
    console.log('Book service:', service.id);
    // Navigate to booking page with service and worker pre-selected
    router.push(`/booking/${worker.brandId}/${worker.id}/${service.id}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <View className="flex-1">
        {/* Worker Header */}
        <View className="relative">
          <Image
            source={{ uri: worker.coverImage }}
            className="w-full h-56"
            resizeMode="cover"
          />

          {/* Header Actions */}
          <View
            className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-4"
            style={{ paddingTop: insets.top + 8 }}
          >
            <Pressable
              onPress={handleBack}
              className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-xl items-center justify-center"
            >
              <Icons.ChevronLeft size={24} className="text-foreground" />
            </Pressable>
          </View>

          {/* Worker Info Card */}
          <View className="px-4 -mt-16">
            <View className="bg-card/50 backdrop-blur-xl rounded-3xl p-4 border border-border/50">
              <View className="flex justify-center items-center gap-3">
                {/* Avatar */}
                <View className="relative">
                  <Image
                    source={{ uri: worker.avatar }}
                    className="w-20 h-20 rounded-2xl"
                  />
                  <View className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-success items-center justify-center border-2 border-card">
                    <View className="w-2 h-2 rounded-full bg-white" />
                  </View>
                </View>

                {/* Info */}

                <View className="flex-row items-center justify-center gap-1">
                  <Text className="font-title text-foreground">
                    {worker.name}
                  </Text>
                  <View className="size-1 rounded-full bg-muted" />
                  <Text className="font-caption text-muted-foreground">
                    {worker.role}
                  </Text>
                </View>
              </View>

              {/* Book Appointment Button */}
              <Button
                className="mt-2 bg-primary"
                onPress={() => setActiveTab('services')}
              >
                <Text className="font-subtitle text-primary-foreground">
                  Book Appointment
                </Text>
              </Button>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as WorkerTabType)}
          className="flex-1 mt-4"
        >
          <TabsList className="bg-background/95 backdrop-blur-xl border-b border-border mb-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-2"
            >
              <TabsTrigger value="about">
                <Text>About</Text>
              </TabsTrigger>
              <TabsTrigger value="services">
                <Text>Services</Text>
              </TabsTrigger>
              <TabsTrigger value="schedule">
                <Text>Schedule</Text>
              </TabsTrigger>
              <TabsTrigger value="reviews">
                <Text>Reviews</Text>
              </TabsTrigger>
            </ScrollView>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="flex-1">
            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: insets.bottom + 10 }}
            >
              <MemberAboutTab
                member={{
                  bio: worker.bio,
                  specialties: worker.specialties,
                }}
                isOwner={isOwner}
              />
            </ScrollView>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="flex-1">
            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: insets.bottom + 10 }}
            >
              <MemberServicesTab
                services={services}
                isOwner={isOwner}
                onServicePress={handleServicePress}
              />
            </ScrollView>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="flex-1">
            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: insets.bottom + 10 }}
            >
              <MemberScheduleTab workingDays={workingDays} isOwner={isOwner} />
            </ScrollView>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="flex-1">
            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: insets.bottom + 10 }}
            >
              <MemberReviewsTab
                reviews={reviews}
                averageRating={worker.rating}
                totalReviews={worker.reviewCount}
              />
            </ScrollView>
          </TabsContent>
        </Tabs>
      </View>
    </SafeAreaView>
  );
};

export default WorkerDetailScreen;
