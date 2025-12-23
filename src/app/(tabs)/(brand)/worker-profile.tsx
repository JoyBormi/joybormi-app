import { Button, Text } from '@/components/ui';
import Icons from '@/lib/icons';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

/**
 * Member Profile Page - For workers to manage their own profile
 * Route: /(tabs)/(brand)/member-profile
 * - Workers can edit their profile, services, and schedule
 * - This is the management/edit page (not public view)
 */
const WorkerProfileScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useUserStore();

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
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Header with Back Button */}
        <View
          className="flex-row items-center justify-between px-6 mb-6"
          style={{ paddingTop: insets.top + 16 }}
        >
          <Text className="font-heading text-xl text-foreground">
            My Profile
          </Text>
        </View>

        {/* Profile Card */}
        <View className="px-6 mb-8">
          <View className="bg-card/50 backdrop-blur-xl rounded-3xl p-6 border border-border/50">
            {/* Avatar and Basic Info */}
            <View className="items-center mb-6">
              <View className="relative mb-4">
                <Image
                  source={{ uri: worker.avatar }}
                  className="w-24 h-24 rounded-3xl"
                />
                <Pressable
                  onPress={handleEdit}
                  className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary items-center justify-center border-2 border-card"
                >
                  <Icons.Pencil size={18} className="text-primary-foreground" />
                </Pressable>
              </View>

              <Text className="font-heading text-2xl text-foreground mb-1">
                {worker.name}
              </Text>
              <Text className="font-subtitle text-muted-foreground mb-3">
                {worker.role}
              </Text>

              {/* Rating Badge */}
              <View className="flex-row items-center gap-2 bg-warning/10 px-4 py-2 rounded-full">
                <Icons.Star size={16} className="text-warning" fill="#f59e0b" />
                <Text className="font-subtitle text-foreground">
                  {worker.rating}
                </Text>
                <Text className="font-caption text-muted-foreground">
                  • {worker.reviewCount} reviews
                </Text>
              </View>
            </View>

            {/* Quick Stats */}
            <View className="flex-row gap-3 mb-6">
              <View className="flex-1 bg-muted/20 rounded-2xl p-4 items-center">
                <Icons.Briefcase size={20} className="text-primary mb-2" />
                <Text className="font-heading text-lg text-foreground">
                  {services.length}
                </Text>
                <Text className="font-caption text-muted-foreground">
                  Services
                </Text>
              </View>
              <View className="flex-1 bg-muted/20 rounded-2xl p-4 items-center">
                <Icons.Calendar size={20} className="text-success mb-2" />
                <Text className="font-heading text-lg text-foreground">
                  {workingDays.length}
                </Text>
                <Text className="font-caption text-muted-foreground">
                  Work Days
                </Text>
              </View>
              <View className="flex-1 bg-muted/20 rounded-2xl p-4 items-center">
                <Icons.Star size={20} className="text-warning mb-2" />
                <Text className="font-heading text-lg text-foreground">
                  {reviews.length}
                </Text>
                <Text className="font-caption text-muted-foreground">
                  Reviews
                </Text>
              </View>
            </View>

            {/* Edit Profile Button */}
            <Button onPress={handleEdit} className="bg-primary">
              <View className="flex-row items-center gap-2">
                <Icons.Pencil size={18} className="text-primary-foreground" />
                <Text className="font-subtitle text-primary-foreground">
                  Edit Profile
                </Text>
              </View>
            </Button>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-8">
          <Text className="font-title text-lg text-foreground mb-4">
            Quick Actions
          </Text>
          <View className="gap-3">
            <Pressable
              onPress={handleAddService}
              className="bg-card/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50 flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-xl bg-primary/10 items-center justify-center">
                  <Icons.Plus size={24} className="text-primary" />
                </View>
                <View>
                  <Text className="font-subtitle text-foreground mb-1">
                    Add New Service
                  </Text>
                  <Text className="font-caption text-muted-foreground">
                    Create a new service offering
                  </Text>
                </View>
              </View>
              <Icons.ChevronRight size={20} className="text-muted-foreground" />
            </Pressable>

            <Pressable
              onPress={handleEditSchedule}
              className="bg-card/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50 flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-xl bg-success/10 items-center justify-center">
                  <Icons.Calendar size={24} className="text-success" />
                </View>
                <View>
                  <Text className="font-subtitle text-foreground mb-1">
                    Manage Schedule
                  </Text>
                  <Text className="font-caption text-muted-foreground">
                    Set your working hours
                  </Text>
                </View>
              </View>
              <Icons.ChevronRight size={20} className="text-muted-foreground" />
            </Pressable>
          </View>
        </View>

        {/* About Section */}
        <View className="px-6 mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-title text-lg text-foreground">About Me</Text>
            <Pressable onPress={handleEdit}>
              <Icons.Pencil size={18} className="text-primary" />
            </Pressable>
          </View>
          <View className="bg-card/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50">
            <Text className="font-body text-muted-foreground leading-6 mb-4">
              {worker.bio}
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {worker.specialties.map((specialty, index) => (
                <View
                  key={index}
                  className="bg-primary/10 px-3 py-2 rounded-full"
                >
                  <Text className="font-caption text-primary">{specialty}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Services Section */}
        <View className="px-6 mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-title text-lg text-foreground">
              My Services ({services.length})
            </Text>
            <Pressable onPress={handleAddService}>
              <Icons.Plus size={20} className="text-primary" />
            </Pressable>
          </View>
          <View className="gap-3">
            {services.map((service) => (
              <Pressable
                key={service.id}
                onPress={() => handleServicePress(service)}
                className="bg-card/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50"
              >
                <View className="flex-row items-start justify-between mb-3">
                  <Text className="font-subtitle text-foreground flex-1">
                    {service.name}
                  </Text>
                  <Text className="font-subtitle text-primary">
                    {service.price}
                  </Text>
                </View>
                <Text className="font-body text-muted-foreground mb-3">
                  {service.description}
                </Text>
                <View className="flex-row items-center gap-2">
                  <Icons.Clock size={16} className="text-muted-foreground" />
                  <Text className="font-caption text-muted-foreground">
                    {service.duration_mins} minutes
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Schedule Overview */}
        <View className="px-6 mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-title text-lg text-foreground">
              Schedule Overview
            </Text>
            <Pressable onPress={handleEditSchedule}>
              <Icons.Calendar size={20} className="text-primary" />
            </Pressable>
          </View>
          <View className="bg-card/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50">
            <Text className="font-body text-muted-foreground mb-3">
              Working {workingDays.length} days per week
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                (day, index) => {
                  const isWorking = workingDays.some(
                    (wd) => wd.day_of_week === index,
                  );
                  return (
                    <View
                      key={day}
                      className={cn(
                        'w-12 h-12 rounded-xl items-center justify-center',
                        isWorking
                          ? 'bg-success/20 border border-success/30'
                          : 'bg-muted/20',
                      )}
                    >
                      <Text
                        className={cn(
                          'font-caption',
                          isWorking ? 'text-success' : 'text-muted-foreground',
                        )}
                      >
                        {day}
                      </Text>
                    </View>
                  );
                },
              )}
            </View>
          </View>
        </View>

        {/* Reviews Section */}
        <View className="px-6">
          <Text className="font-title text-lg text-foreground mb-4">
            Recent Reviews ({reviews.length})
          </Text>
          <View className="gap-3">
            {reviews.slice(0, 2).map((review) => (
              <View
                key={review.id}
                className="bg-card/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50"
              >
                <View className="flex-row items-start gap-3 mb-3">
                  <Image
                    source={{ uri: review.customer_avatar }}
                    className="w-10 h-10 rounded-full"
                  />
                  <View className="flex-1">
                    <Text className="font-subtitle text-foreground mb-1">
                      {review.customer_name}
                    </Text>
                    <View className="flex-row items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Icons.Star
                          key={star}
                          size={14}
                          className="text-warning"
                          fill={star <= review.rating ? '#f59e0b' : 'none'}
                        />
                      ))}
                    </View>
                  </View>
                </View>
                <Text className="font-body text-muted-foreground">
                  {review.comment}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WorkerProfileScreen;
