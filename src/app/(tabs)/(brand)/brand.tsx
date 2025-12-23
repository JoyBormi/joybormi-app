import { Text } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useYScroll } from '@/hooks/common/use-y-scroll';
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
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const BrandScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { onScroll } = useYScroll();
  const [activeTab, setActiveTab] = useState<BrandTabType>('home');

  // Mock data - In production, fetch from API based on brand ID
  const brand = mockBrand;
  const services = mockServices;
  const workers = mockWorkers;
  const photos = mockPhotos;
  const reviews = mockReviews;

  const handleBack = () => {
    router.back();
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Share brand');
  };

  const handleFavorite = () => {
    // Implement favorite functionality
    console.log('Toggle favorite');
  };

  const handleServicePress = (service: (typeof services)[0]) => {
    console.log('Service pressed:', service.id);
    // Navigate to service details or booking
  };

  const handleWorkerPress = (worker: (typeof workers)[0]) => {
    console.log('Worker pressed:', worker.id);
    // Navigate to worker profile
  };

  const handlePhotoPress = (photo: (typeof photos)[0], index: number) => {
    console.log('Photo pressed:', photo.id, index);
    // Open photo gallery
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
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <ScrollView
        onScroll={onScroll}
        bounces={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + (Platform.OS === 'ios' ? 50 : 90),
        }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
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
          className="mt-4"
        >
          <TabsList className="bg-background/95 backdrop-blur-xl border-b border-border px-4 py-2">
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
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="home" className="mt-4">
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

          <TabsContent value="services" className="mt-4">
            <ServicesTab
              services={services}
              onServicePress={handleServicePress}
            />
          </TabsContent>

          <TabsContent value="workers" className="mt-4">
            <WorkersTab workers={workers} onWorkerPress={handleWorkerPress} />
          </TabsContent>

          <TabsContent value="photos" className="mt-4">
            <PhotosTab photos={photos} onPhotoPress={handlePhotoPress} />
          </TabsContent>

          <TabsContent value="reviews" className="mt-4">
            <ReviewsTab
              brand={brand}
              reviews={reviews}
              onHelpful={handleHelpful}
              onWriteReview={handleWriteReview}
            />
          </TabsContent>

          <TabsContent value="about" className="mt-4">
            <AboutTab brand={brand} />
          </TabsContent>
        </Tabs>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BrandScreen;
