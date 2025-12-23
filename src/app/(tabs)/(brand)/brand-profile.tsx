import { Text } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserStore } from '@/stores';
import { BrandTabType } from '@/types/brand.type';
import { EUserType } from '@/types/user.type';
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
import { ScrollView, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

/**
 * Brand Profile Management Page - For creators/workers to manage their brand
 * Route: /(tabs)/(brand)/brand-profile
 * This page allows editing and managing brand information
 */
const BrandProfileScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { appType } = useUserStore();
  const [activeTab, setActiveTab] = useState<BrandTabType>('home');

  // Check if user is creator or worker
  const isCreator = appType === EUserType.CREATOR;
  const isWorker = appType === EUserType.WORKER;
  const canEdit = isCreator || isWorker;

  // Mock data - In production, fetch from API based on user's brand
  const brand = mockBrand;
  const services = mockServices;
  const workers = mockWorkers;
  const photos = mockPhotos;
  const reviews = mockReviews;

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    // Navigate to edit brand page
    console.log('Edit brand');
    // router.push('/brand/edit');
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Share brand');
  };

  const handleServicePress = (service: (typeof services)[0]) => {
    console.log('Service pressed:', service.id);
    if (canEdit) {
      // Navigate to edit service
      // router.push(`/service/edit/${service.id}`);
    }
  };

  const handleAddService = () => {
    console.log('Add new service');
    // router.push('/service/create');
  };

  const handleWorkerPress = (worker: (typeof workers)[0]) => {
    console.log('Worker pressed:', worker.id);
    if (isCreator) {
      // Navigate to manage worker
      // router.push(`/worker/manage/${worker.id}`);
    }
  };

  const handleAddWorker = () => {
    console.log('Add new worker');
    // router.push('/worker/invite');
  };

  const handlePhotoPress = (photo: (typeof photos)[0], index: number) => {
    console.log('Photo pressed:', photo.id, index);
    if (canEdit) {
      // Open photo management
    }
  };

  const handleAddPhoto = () => {
    console.log('Add new photo');
    // Open image picker
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
          onFavorite={canEdit ? handleEdit : undefined}
          isOwner={canEdit}
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
              canEdit={canEdit}
              onAddService={handleAddService}
              onAddWorker={handleAddWorker}
              onAddPhoto={handleAddPhoto}
            />
          </TabsContent>

          <TabsContent value="services" className="flex-1">
            <ServicesTab
              services={services}
              onServicePress={handleServicePress}
              canEdit={canEdit}
              onAddService={handleAddService}
            />
          </TabsContent>

          <TabsContent value="workers" className="flex-1">
            <WorkersTab
              workers={workers}
              onWorkerPress={handleWorkerPress}
              canEdit={isCreator}
              onAddWorker={handleAddWorker}
            />
          </TabsContent>

          <TabsContent value="photos" className="flex-1">
            <PhotosTab
              photos={photos}
              onPhotoPress={handlePhotoPress}
              canEdit={canEdit}
              onAddPhoto={handleAddPhoto}
            />
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
            <AboutTab brand={brand} canEdit={canEdit} onEdit={handleEdit} />
          </TabsContent>
        </Tabs>
      </View>
    </SafeAreaView>
  );
};

export default BrandProfileScreen;
