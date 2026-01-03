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
import { useGetBrand, useUpdateBrand } from '@/hooks/brand';
import { useUploadFile } from '@/hooks/common';
import { useGetSchedule, useUpdateSchedule } from '@/hooks/schedule';
import {
  useCreateService,
  useDeleteService,
  useGetServices,
  useUpdateService,
} from '@/hooks/service';
import { useUserStore } from '@/stores';
import { BrandStatus } from '@/types/brand.type';
import { ServiceOwnerType, type IService } from '@/types/service.type';
import { EUserType } from '@/types/user.type';
import { pickImage } from '@/utils/file-upload';
import { mockPhotos, mockReviews, mockWorkers } from '@/views/brand';
import {
  BrandAbout,
  BrandCard,
  BrandQuickActions,
  BrandServicesList,
  BrandTeamList,
} from '@/views/brand-profile/components';
import { BrandProfilePendingScreen } from '@/views/brand-profile/in-pending';

import type { IWorkingDay } from '@/types/schedule.type';

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

  // Fetch brand data
  const {
    data: brand,
    isLoading: isBrandLoading,
    refetch: refetchBrand,
  } = useGetBrand({
    userId: user?.id,
  });

  // Fetch services
  const {
    data: services = [],
    isLoading: isServicesLoading,
    refetch: refetchServices,
  } = useGetServices({
    brandId: brand?.id,
    ownerType: 'BRAND' as const,
  });

  // Fetch schedule
  const { data: schedule, refetch: refetchSchedule } = useGetSchedule({
    brandId: brand?.id,
  });

  // Mutations
  const updateBrandMutation = useUpdateBrand(brand?.id || '');
  const uploadFileMutation = useUploadFile();
  const createServiceMutation = useCreateService(brand?.id || '');
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();
  const updateScheduleMutation = useUpdateSchedule(brand?.id || '');

  // Local state for UI (TODO: Replace with real API data)
  const [workers] = useState(mockWorkers);
  const [photos, setPhotos] = useState(mockPhotos);
  const [reviews] = useState(mockReviews);
  const [selectedService, setSelectedService] = useState<IService | null>(null);

  const isLoading = isBrandLoading || isServicesLoading;
  const refetch = () => {
    refetchBrand();
    refetchServices();
    refetchSchedule();
  };

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

  const handleUploadBanner = async (uri: string) => {
    if (!brand?.id) return;

    try {
      const file = await pickImage({ allowsEditing: true, aspect: [16, 9] });
      if (!file) return;

      const { url } = await uploadFileMutation.mutateAsync({ file });
      await updateBrandMutation.mutateAsync({ bannerImage: url });
    } catch (error) {
      console.error('Failed to upload banner:', error);
    }
  };

  const handleEditProfileImage = () => {
    uploadProfileImageSheetRef.current?.present();
  };

  const handleUploadProfileImage = async (uri: string) => {
    if (!brand?.id) return;

    try {
      const file = await pickImage({ allowsEditing: true, aspect: [1, 1] });
      if (!file) return;

      const { url } = await uploadFileMutation.mutateAsync({ file });
      await updateBrandMutation.mutateAsync({ profileImage: url });
    } catch (error) {
      console.error('Failed to upload profile image:', error);
    }
  };

  const handleAddService = () => {
    setSelectedService(null);
    upsertServiceSheetRef.current?.present();
  };

  const handleServicePress = (service: IService) => {
    setSelectedService(service);
    upsertServiceSheetRef.current?.present();
  };

  const handleSaveService = async (
    serviceId: string | null,
    data: {
      name: string;
      description: string;
      durationMins: number;
      price: string;
    },
  ) => {
    try {
      if (serviceId) {
        await updateServiceMutation.mutateAsync({
          serviceId,
          payload: {
            name: data.name,
            description: data.description,
            durationMins: data.durationMins,
            price: parseFloat(data.price),
          },
        });
      } else {
        await createServiceMutation.mutateAsync({
          name: data.name,
          description: data.description,
          durationMins: data.durationMins,
          price: parseFloat(data.price),
          ownerType: ServiceOwnerType.BRAND,
        });
      }
      refetchServices();
    } catch (error) {
      console.error('Failed to save service:', error);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      await deleteServiceMutation.mutateAsync(serviceId);
      refetchServices();
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
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

  const handleSaveSchedule = async (newWorkingDays: IWorkingDay[]) => {
    if (!brand?.id) return;

    try {
      await updateScheduleMutation.mutateAsync({
        workingDays: newWorkingDays.map((day) => ({
          dayOfWeek: day.dayOfWeek,
          startTime: day.startTime,
          endTime: day.endTime,
          breaks: day.breaks?.map((b) => ({
            startTime: b.startTime,
            endTime: b.endTime,
          })),
        })),
      });
      refetchSchedule();
    } catch (error) {
      console.error('Failed to update schedule:', error);
    }
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

  // Early return if no brand data
  if (!brand && !isLoading) {
    return <NotFoundScreen />;
  }

  return (
    <Fragment>
      {isLoading ? (
        <LoadingScreen />
      ) : brand && brand.status === BrandStatus.PENDING ? (
        <BrandProfilePendingScreen onRefresh={refetchBrand} />
      ) : brand && brand.status === BrandStatus.SUSPENDED ? (
        <SuspendedScreen />
      ) : brand && brand.status === BrandStatus.WITHDRAWN ? (
        <BlockedScreen />
      ) : brand && brand.status === BrandStatus.REJECTED ? (
        <NotFoundScreen />
      ) : brand ? (
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
            {/* <BrandPhotosGrid
              photos={photos}
              canEdit={canEdit}
              onAddPhoto={handleAddPhoto}
              onPhotoPress={handlePhotoPress}
            /> */}

            {/* Reviews Section */}
            {/* <BrandReviewsList reviews={reviews} maxDisplay={2} /> */}
          </ScrollView>

          {/* Bottom Sheets */}
          <UploadBannerSheet
            ref={uploadBannerSheetRef}
            currentBanner={brand.bannerImage || ''}
            onUpload={handleUploadBanner}
          />

          <UploadProfileImageSheet
            ref={uploadProfileImageSheetRef}
            currentImage={brand.profileImage || ''}
            onUpload={handleUploadProfileImage}
          />

          <UpsertServiceSheet
            ref={upsertServiceSheetRef}
            service={
              selectedService
                ? {
                    id: selectedService.id,
                    name: selectedService.name,
                    description: selectedService.description || '',
                    durationMins: selectedService.durationMins,
                    price: selectedService.price.toString(),
                    creatorId: selectedService.ownerId,
                    brandId: selectedService.brandId,
                    createdAt: selectedService.createdAt,
                  }
                : null
            }
            onSave={handleSaveService}
            onDelete={handleDeleteService}
          />

          <InviteTeamSheet
            ref={inviteTeamSheetRef}
            brandId={brand.id}
            brandName={brand.brandName}
          />

          <UploadPhotosSheet
            ref={uploadPhotosSheetRef}
            onUpload={handleUploadPhotos}
          />

          <ManageScheduleSheet
            ref={manageScheduleSheetRef}
            workingDays={schedule?.workingDays || []}
            onSave={handleSaveSchedule}
          />
        </SafeAreaView>
      ) : (
        <NotFoundScreen />
      )}
    </Fragment>
  );
};

export default BrandProfileScreen;
