import { Button, Text } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icons from '@/lib/icons';
import { useUserStore } from '@/stores';
import { EUserType } from '@/types/user.type';
import {
  MemberAboutTab,
  MemberReviewsTab,
  MemberScheduleTab,
  MemberServicesTab,
} from '@/views/member';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

type WorkerTabType = 'about' | 'services' | 'schedule' | 'reviews';

/**
 * Member Profile Page - For workers to manage their own profile
 * Route: /(tabs)/(brand)/member-profile
 * - Workers can edit their profile, services, and schedule
 * - This is the management/edit page (not public view)
 */
const WorkerProfileScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, appType } = useUserStore();
  const [activeTab, setActiveTab] = useState<WorkerTabType>('about');

  // Only workers can access this page
  const isOwner = appType === EUserType.WORKER;

  // Mock worker data - In production, fetch from API based on logged-in user
  const worker = {
    id: user?.id || 'worker-123',
    userId: user?.id || 'worker-123',
    brandId: 'brand-123',
    name: user?.first_name + ' ' + user?.last_name || 'Sarah Johnson',
    role: 'Senior Stylist',
    avatar: 'https://i.pravatar.cc/150?img=5',
    coverImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035',
    bio: 'Passionate hair stylist with 8+ years of experience in color treatments and modern cuts.',
    specialties: ['Hair Coloring', 'Balayage', 'Haircuts', 'Styling'],
    rating: 4.9,
    reviewCount: 127,
    status: 'active' as const,
    email: 'sarah.j@example.com',
    phone: '+1 (555) 123-4567',
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

  const handleEdit = () => {
    console.log('Edit worker profile');
    // Navigate to edit mode or open edit modal
  };

  const handleAddService = () => {
    console.log('Add new service');
    // Navigate to service creation page
  };

  const handleServicePress = (service: (typeof services)[0]) => {
    console.log('Edit service:', service.id);
    // Navigate to service edit page
  };

  const handleEditSchedule = () => {
    console.log('Edit schedule');
    // Navigate to schedule editor
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

            {isOwner && (
              <Pressable
                onPress={handleEdit}
                className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-xl items-center justify-center"
              >
                <Icons.Pencil size={20} className="text-foreground" />
              </Pressable>
            )}
          </View>

          {/* Worker Info Card */}
          <View className="px-4 -mt-24">
            <View className="bg-card/50 backdrop-blur-xl rounded-3xl p-4 border border-border/50">
              <View className="flex-row items-start gap-3">
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
                <View className="flex-1">
                  <Text className="font-title text-foreground">
                    {worker.name}
                  </Text>
                  <Text className="font-caption text-muted-foreground mt-0.5">
                    {worker.role}
                  </Text>

                  {/* Rating */}
                  <View className="flex-row items-center gap-1 mt-2">
                    <Icons.Star
                      size={16}
                      className="text-warning"
                      fill="#f59e0b"
                    />
                    <Text className="font-body text-foreground">
                      {worker.rating}
                    </Text>
                    <Text className="font-caption text-muted-foreground">
                      ({worker.reviewCount} reviews)
                    </Text>
                  </View>
                </View>
              </View>

              {/* Edit Profile Button */}
              <Button
                onPress={handleEdit}
                className="mt-4 bg-primary/10 border border-primary/20"
              >
                <View className="flex-row items-center gap-2">
                  <Icons.Pencil size={18} className="text-primary" />
                  <Text className="font-subtitle text-primary">
                    Edit Profile
                  </Text>
                </View>
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
          <TabsList className="bg-background/95 backdrop-blur-xl border-b border-border">
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
                  email: worker.email,
                  phone: worker.phone,
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
                onAddService={handleAddService}
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
              <MemberScheduleTab
                workingDays={workingDays}
                isOwner={isOwner}
                onEditSchedule={handleEditSchedule}
              />
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

export default WorkerProfileScreen;
