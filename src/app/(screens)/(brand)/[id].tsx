import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { Text } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { routes } from '@/constants/routes';
import { BrandTabType } from '@/types/brand.type';
import {
  AboutTab,
  BrandHeader,
  HomeTab,
  PhotosTab,
  ReviewsTab,
  ServicesTab,
  WorkersTab,
  mockBrand,
  mockPhotos,
  mockReviews,
  mockServices,
  mockWorkers,
} from '@/views/brand';

/**
 * Dynamic Brand Detail Page - For clients to view brand details
 * Route: /(tabs)/(brand)/[id]
 * This page is read-only for clients to browse and book services
 */
const BrandDetailScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<BrandTabType>('home');

  // Mock data - In production, fetch from API based on brand ID from params
  const brand = mockBrand;
  const services = mockServices;
  const workers = mockWorkers;
  const photos = mockPhotos;
  const reviews = mockReviews;

  const handleBack = () => {
    router.back();
  };

  const handleShare = () => {
    console.log('Share brand:', id);
  };

  const handleFavorite = () => {
    console.log('Toggle favorite:', id);
  };

  const handleServicePress = (service: (typeof services)[0]) => {
    console.log('Service pressed:', service.id);
    // Navigate to booking page
    // router.push(`/(screens)/(booking)${service.id}`);
  };

  const handleWorkerPress = (worker: (typeof workers)[0]) => {
    console.log('Worker pressed:', worker.id);
    // Navigate to worker profile
    router.push(routes.dynamic_brand.team_worker(worker.id));
  };

  const handlePhotoPress = (photo: (typeof photos)[0], index: number) => {
    console.log('Photo pressed:', photo.id, index);
    // Open photo gallery modal
  };

  const handleWriteReview = () => {
    console.log('Write review');
    // Navigate to review form
  };

  const handleHelpful = (reviewId: string) => {
    console.log('Mark helpful:', reviewId);
    // Update helpful count
  };

  return (
    <SafeAreaView className="safe-area" edges={['bottom']}>
      <View className="flex-1">
        {/* Brand Header */}
        <BrandHeader
          brand={brand}
          onBack={handleBack}
          onShare={handleShare}
          onFavorite={handleFavorite}
        />

        {/* Tab Navigation */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as BrandTabType)}
          className="flex-1"
        >
          <TabsList className="bg-background/95 backdrop-blur-xl border-b border-border my-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-2"
            >
              <TabsTrigger value="home">
                <Text>Home</Text>
              </TabsTrigger>
              <TabsTrigger value="services">
                <Text>Services</Text>
              </TabsTrigger>
              <TabsTrigger value="workers">
                <Text>Team</Text>
              </TabsTrigger>
              <TabsTrigger value="photos">
                <Text>Photos</Text>
              </TabsTrigger>
              <TabsTrigger value="reviews">
                <Text>Reviews</Text>
              </TabsTrigger>
              <TabsTrigger value="about">
                <Text>About</Text>
              </TabsTrigger>
            </ScrollView>
          </TabsList>

          {/* Tab Contents with proper scrolling */}
          <TabsContent value="home" className="flex-1">
            <HomeTab
              brand={brand}
              services={services}
              workers={workers}
              photos={photos}
              onServicePress={handleServicePress}
              onWorkerPress={handleWorkerPress}
              onPhotoPress={handlePhotoPress}
              onViewAllServices={() => setActiveTab('services')}
              onViewAllWorkers={() => setActiveTab('workers')}
              onViewAllPhotos={() => setActiveTab('photos')}
            />
          </TabsContent>

          <TabsContent value="services" className="flex-1">
            <ServicesTab
              services={services}
              onServicePress={handleServicePress}
            />
          </TabsContent>

          <TabsContent value="workers" className="flex-1">
            <WorkersTab workers={workers} onWorkerPress={handleWorkerPress} />
          </TabsContent>

          <TabsContent value="photos" className="flex-1">
            <PhotosTab photos={photos} onPhotoPress={handlePhotoPress} />
          </TabsContent>

          <TabsContent value="reviews" className="flex-1">
            <ReviewsTab
              brand={brand}
              reviews={reviews}
              onHelpful={handleHelpful}
              onWriteReview={handleWriteReview}
            />
          </TabsContent>

          <TabsContent value="about" className="flex-1">
            <AboutTab brand={brand} />
          </TabsContent>
        </Tabs>
      </View>
    </SafeAreaView>
  );
};

export default BrandDetailScreen;
