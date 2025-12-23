import { Button, Text } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icons from '@/lib/icons';
import { useUserStore } from '@/stores';
import { EUserType } from '@/types/user.type';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

type WorkerTabType = 'about' | 'services' | 'schedule' | 'reviews';

/**
 * Worker Profile Page - Dynamic route for individual worker profiles
 * Route: /(tabs)/(brand)/worker/[id]
 * - Workers can edit their own profile, services, and schedule
 * - Others can view worker details and book services
 */
const WorkerProfileScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { user, appType } = useUserStore();
  const [activeTab, setActiveTab] = useState<WorkerTabType>('about');

  // Check if current user is this worker
  const isOwner = user?.id === id && appType === EUserType.WORKER;

  // Mock worker data - In production, fetch from API
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
    email: 'sarah.j@example.com',
    phone: '+1 (555) 123-4567',
  };

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    console.log('Edit worker profile');
    // Navigate to edit mode
  };

  const handleBooking = () => {
    console.log('Book with worker:', id);
    // Navigate to booking page
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

              {/* Action Button */}
              {!isOwner && (
                <Button onPress={handleBooking} className="mt-4 bg-primary">
                  <Text className="font-subtitle text-primary-foreground">
                    Book Appointment
                  </Text>
                </Button>
              )}
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
              className="flex-1 px-4"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: insets.bottom + 10 }}
            >
              <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 300 }}
              >
                {/* Bio */}
                <View className="mb-4">
                  <Text className="font-title text-foreground mb-2">Bio</Text>
                  <Text className="font-body text-muted-foreground leading-6">
                    {worker.bio}
                  </Text>
                </View>

                {/* Specialties */}
                <View className="mb-4">
                  <Text className="font-title text-foreground mb-2">
                    Specialties
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {worker.specialties.map((specialty, index) => (
                      <View
                        key={index}
                        className="bg-muted/50 px-3 py-1.5 rounded-full"
                      >
                        <Text className="font-caption text-muted-foreground">
                          {specialty}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Contact */}
                {isOwner && (
                  <View className="mb-4">
                    <Text className="font-title text-foreground mb-2">
                      Contact
                    </Text>
                    <View className="gap-3">
                      <View className="flex-row items-center gap-3">
                        <Icons.Mail
                          size={20}
                          className="text-muted-foreground"
                        />
                        <Text className="font-body text-foreground">
                          {worker.email}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-3">
                        <Icons.Phone
                          size={20}
                          className="text-muted-foreground"
                        />
                        <Text className="font-body text-foreground">
                          {worker.phone}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </MotiView>
            </ScrollView>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="flex-1">
            <ScrollView
              className="flex-1 px-4"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: insets.bottom + 10 }}
            >
              <Text className="font-body text-muted-foreground text-center mt-8">
                Services management coming soon
              </Text>
            </ScrollView>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="flex-1">
            <ScrollView
              className="flex-1 px-4"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: insets.bottom + 10 }}
            >
              <Text className="font-body text-muted-foreground text-center mt-8">
                Schedule management coming soon
              </Text>
            </ScrollView>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="flex-1">
            <ScrollView
              className="flex-1 px-4"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: insets.bottom + 10 }}
            >
              <Text className="font-body text-muted-foreground text-center mt-8">
                Reviews coming soon
              </Text>
            </ScrollView>
          </TabsContent>
        </Tabs>
      </View>
    </SafeAreaView>
  );
};

export default WorkerProfileScreen;
