import { useUserStore } from '@/stores';
import { EUserType } from '@/types/user.type';
import {
  mockBrand,
  mockPhotos,
  mockReviews,
  mockServices,
  mockWorkers,
} from '@/views/brand';
import {
  BrandAbout,
  BrandCard,
  BrandPhotosGrid,
  BrandQuickActions,
  BrandReviewsList,
  BrandServicesList,
  BrandTeamList,
} from '@/views/brand-profile/components';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native';
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

  // Check if user is creator or worker
  const isCreator = appType === EUserType.CREATOR;
  const canEdit = isCreator;

  // Mock data - In production, fetch from API based on user's brand
  const brand = mockBrand;
  const services = mockServices;
  const workers = mockWorkers;
  const photos = mockPhotos;
  const reviews = mockReviews;

  // Handlers
  const handleEditBrand = () => {
    console.warn('Edit brand');
    // TODO: Open edit brand sheet
  };

  const handleAddService = () => {
    console.warn('Add new service');
    // TODO: Open add service sheet
  };

  const handleServicePress = (service: (typeof services)[0]) => {
    console.warn('Service pressed:', service.id);
    // TODO: Open edit service sheet
  };

  const handleAddWorker = () => {
    console.warn('Add new worker');
    // TODO: Open invite worker sheet
  };

  const handleWorkerPress = (worker: (typeof workers)[0]) => {
    router.push(`/(dynamic-brand)/team/worker/${worker.id}`);
  };

  const handleManageHours = () => {
    console.warn('Manage hours');
    // TODO: Open schedule management sheet
  };

  const handleAddPhoto = () => {
    console.warn('Add photo');
    // TODO: Open image picker
  };

  const handlePhotoPress = (photo: (typeof photos)[0], index: number) => {
    console.warn('Photo pressed:', photo.id, index);
    // TODO: Open photo viewer
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Brand Profile Card */}
        <BrandCard
          brand={brand}
          servicesCount={services.length}
          workersCount={workers.length}
          photosCount={photos.length}
          canEdit={canEdit}
          onEdit={handleEditBrand}
        />

        {/* Quick Actions */}
        {canEdit && (
          <BrandQuickActions
            onAddService={handleAddService}
            onAddWorker={handleAddWorker}
            onManageHours={handleManageHours}
          />
        )}

        {/* About Section */}
        <BrandAbout brand={brand} canEdit={canEdit} onEdit={handleEditBrand} />

        {/* Services Section */}
        <BrandServicesList
          services={services}
          canEdit={canEdit}
          onAddService={handleAddService}
          onServicePress={handleServicePress}
        />

        {/* Team Section */}
        <BrandTeamList
          workers={workers}
          canEdit={canEdit}
          onAddWorker={handleAddWorker}
          onWorkerPress={handleWorkerPress}
        />

        {/* Photos Section */}
        <BrandPhotosGrid
          photos={photos}
          canEdit={canEdit}
          onAddPhoto={handleAddPhoto}
          onPhotoPress={handlePhotoPress}
        />

        {/* Reviews Section */}
        <BrandReviewsList reviews={reviews} maxDisplay={2} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default BrandProfileScreen;
