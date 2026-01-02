import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { Fragment, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {
  InviteTeamSheet,
  ManageScheduleSheet,
  UploadBannerSheet,
  UploadPhotosSheet,
  UploadProfileImageSheet,
  UpsertServiceSheet,
} from '@/components/shared/brand-worker';
import {
  BlockedScreen,
  LoadingScreen,
  NotFoundScreen,
  SuspendedScreen,
} from '@/components/shared/status-screens';
import { useGetBrand } from '@/hooks/brand';
import { useUserStore } from '@/stores';
import { BrandStatus, type IBrandService } from '@/types/brand.type';
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
import { BrandProfilePendingScreen } from '@/views/brand-profile/in-pending';

import type { IWorkingDay } from '@/types/worker.type';

/**
 * Brand Profile Management Page - For creators/workers to manage their brand
 * Route: /(tabs)/(brand)/brand-profile
 * This page allows editing and managing brand information
 */
const BrandProfileScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { appType, user } = useUserStore();

  // Check if user is creator or worker
  const isCreator = appType === EUserType.CREATOR;
  const canEdit = isCreator;

  const { data, isLoading, refetch } = useGetBrand({
    userId: user?.id,
  });
  console.log(`🚀 ~ brandData:`, data);

  // State - In production, fetch from API based on user's brand
  const [brand] = useState(mockBrand);
  const [services, setServices] = useState(mockServices);
  const [workers] = useState(mockWorkers);
  const [photos, setPhotos] = useState(mockPhotos);
  const [reviews] = useState(mockReviews);
  const [workingDays, setWorkingDays] = useState<IWorkingDay[]>([]);
  const [selectedService, setSelectedService] = useState<IBrandService | null>(
    null,
  );

  // Bottom sheet refs
  const uploadBannerSheetRef = useRef<BottomSheetModal>(null);
  const uploadProfileImageSheetRef = useRef<BottomSheetModal>(null);
  const upsertServiceSheetRef = useRef<BottomSheetModal>(null);
  const inviteTeamSheetRef = useRef<BottomSheetModal>(null);
  const uploadPhotosSheetRef = useRef<BottomSheetModal>(null);
  const manageScheduleSheetRef = useRef<BottomSheetModal>(null);

  // Handlers
  const handleEditBrand = () => {
    router.push('/(slide-screens)/(brand)/edit-brand-profile');
  };

  const handleSaveBrand = () => {
    console.warn('Save brand:', brand);
    // TODO: API call to update brand
  };

  const handleEditBanner = () => {
    uploadBannerSheetRef.current?.present();
  };

  const handleUploadBanner = (uri: string) => {
    console.warn('Upload banner:', uri);
    // TODO: API call to update banner
  };

  const handleEditProfileImage = () => {
    uploadProfileImageSheetRef.current?.present();
  };

  const handleUploadProfileImage = (uri: string) => {
    console.warn('Upload profile image:', uri);
    // TODO: API call to update profile image
  };

  const handleAddService = () => {
    setSelectedService(null);
    upsertServiceSheetRef.current?.present();
  };

  const handleServicePress = (service: IBrandService) => {
    setSelectedService(service);
    upsertServiceSheetRef.current?.present();
  };

  const handleSaveService = (
    serviceId: string | null,
    data: {
      name: string;
      description: string;
      durationMins: number;
      price: string;
    },
  ) => {
    if (serviceId) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === serviceId
            ? {
                ...s,
                name: data.name,
                description: data.description,
                duration: data.durationMins,
                price: parseFloat(data.price),
              }
            : s,
        ),
      );
      console.warn('Service updated:', serviceId, data);
    } else {
      const newService: IBrandService = {
        id: `service-${Date.now()}`,
        name: data.name,
        description: data.description,
        duration: data.durationMins,
        price: parseFloat(data.price),
        currency: 'USD',
        category: 'General',
        popular: false,
      };
      setServices((prev) => [...prev, newService]);
      console.warn('Service added:', newService);
    }
  };

  const handleDeleteService = (serviceId: string) => {
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
    console.warn('Service deleted:', serviceId);
  };

  const handleAddWorker = () => {
    inviteTeamSheetRef.current?.present();
  };

  const handleWorkerPress = (worker: (typeof workers)[0]) => {
    router.push(`/(dynamic-brand)/team/worker/${worker.id}`);
  };

  const handleManageHours = () => {
    manageScheduleSheetRef.current?.present();
  };

  const handleSaveSchedule = (newWorkingDays: IWorkingDay[]) => {
    setWorkingDays(newWorkingDays);
    console.warn('Schedule updated:', newWorkingDays);
    // TODO: API call to update schedule
  };

  const handleAddPhoto = () => {
    uploadPhotosSheetRef.current?.present();
  };

  const handlePhotoPress = () => {
    uploadPhotosSheetRef.current?.present();
  };

  const handleUploadPhotos = (
    newPhotos: { uri: string; category: string }[],
  ) => {
    const photosToAdd = newPhotos.map((photo, index) => ({
      id: `photo-${Date.now()}-${index}`,
      url: photo.uri,
      caption: '',
      category: photo.category as
        | 'interior'
        | 'exterior'
        | 'service'
        | 'team'
        | 'other',
      uploadedAt: new Date().toISOString(),
    }));
    setPhotos((prev) => [...prev, ...photosToAdd]);
    console.warn('Photos added:', photosToAdd);
    // TODO: API call to upload photos
  };

  return (
    <Fragment>
      {isLoading ? (
        <LoadingScreen />
      ) : data && data.status === BrandStatus.PENDING ? (
        <BrandProfilePendingScreen onRefresh={refetch} />
      ) : data && data.status === BrandStatus.SUSPENDED ? (
        <SuspendedScreen />
      ) : data && data.status === BrandStatus.WITHDRAWN ? (
        <BlockedScreen />
      ) : data && data.status === BrandStatus.REJECTED ? (
        <NotFoundScreen />
      ) : (
        <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refetch} />
            }
          >
            {/* Brand Profile Card */}
            <BrandCard
              brand={brand}
              servicesCount={services.length}
              workersCount={workers.length}
              photosCount={photos.length}
              canEdit={canEdit}
              onEditAvatar={handleEditProfileImage}
              onEditBanner={handleEditBanner}
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
            <BrandAbout
              brand={brand}
              canEdit={canEdit}
              onEdit={handleEditBanner}
            />

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

          {/* Bottom Sheets */}
          <UploadBannerSheet
            ref={uploadBannerSheetRef}
            currentBanner={brand.coverImage}
            onUpload={handleUploadBanner}
          />

          <UploadProfileImageSheet
            ref={uploadProfileImageSheetRef}
            currentImage={brand.logo}
            onUpload={handleUploadProfileImage}
          />

          <UpsertServiceSheet
            ref={upsertServiceSheetRef}
            service={
              selectedService
                ? {
                    id: selectedService.id,
                    name: selectedService.name,
                    description: selectedService.description,
                    durationMins: selectedService.duration,
                    price: selectedService.price.toString(),
                    creatorId: '',
                    brandId: brand.id,
                    createdAt: new Date().toISOString(),
                  }
                : null
            }
            onSave={handleSaveService}
            onDelete={handleDeleteService}
          />

          <InviteTeamSheet
            ref={inviteTeamSheetRef}
            brandId={brand.id}
            brandName={brand.name}
          />

          <UploadPhotosSheet
            ref={uploadPhotosSheetRef}
            onUpload={handleUploadPhotos}
          />

          <ManageScheduleSheet
            ref={manageScheduleSheetRef}
            workingDays={workingDays}
            onSave={handleSaveSchedule}
          />
        </SafeAreaView>
      )}
    </Fragment>
  );
};

export default BrandProfileScreen;
