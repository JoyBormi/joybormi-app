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
  UploadBannerSheet,
  UploadPhotosSheet,
  UploadProfileImageSheet,
} from '@/components/shared/brand-worker';
import {
  BlockedScreen,
  NotFoundScreen,
  SuspendedScreen,
} from '@/components/shared/status-screens';
import { useGetBrand, useUpdateBrand } from '@/hooks/brand';
import { useUploadFile } from '@/hooks/common';
import { useGetServices } from '@/hooks/service';
import { useUserStore } from '@/stores';
import { BrandStatus } from '@/types/brand.type';
import { EUserType } from '@/types/user.type';
import { pickImage } from '@/utils/file-upload';
import {
  BrandAbout,
  BrandCard,
  BrandQuickActions,
  BrandServicesList,
  BrandTeamList,
} from '@/views/brand-profile/components';
import { BrandProfilePendingScreen } from '@/views/brand-profile/in-pending';
import {
  BrandAboutSkeleton,
  BrandCardSkeleton,
  BrandQuickActionsSkeleton,
  BrandServicesListSkeleton,
  BrandTeamListSkeleton,
} from '@/views/brand-profile/skeletons';

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
    data: services,
    isLoading: isServicesLoading,
    refetch: refetchServices,
  } = useGetServices({
    brandId: brand?.id,
    ownerId: user?.id,
  });

  // Mutations
  const updateBrandMutation = useUpdateBrand(brand?.id || '');
  const uploadFileMutation = useUploadFile();

  // Local state for UI
  // TODO: Replace with real types when API is connected
  const [workers] = useState<unknown[]>([]);
  const [photos, setPhotos] = useState<unknown[]>([]);

  const refetch = () => {
    refetchBrand();
    refetchServices();
  };

  // Bottom sheet refs
  const uploadBannerSheetRef = useRef<BottomSheetModal>(null);
  const uploadProfileImageSheetRef = useRef<BottomSheetModal>(null);
  const inviteTeamSheetRef = useRef<BottomSheetModal>(null);
  const uploadPhotosSheetRef = useRef<BottomSheetModal>(null);

  // Handlers
  const handleEditBrand = () => {
    router.push('/(slide-screens)/(brand)/edit-brand-profile');
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

  const handleAddWorker = () => {
    inviteTeamSheetRef.current?.present();
  };

  const handleWorkerPress = (worker: (typeof workers)[0]) => {
    router.push(`/(dynamic-brand)/team/worker/${worker.id}`);
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

  if (isBrandLoading) {
    return (
      <SafeAreaView className="main-area" edges={['top']}>
        {/* Section Skeletons */}
        <BrandCardSkeleton />
        <BrandQuickActionsSkeleton />
        <BrandAboutSkeleton />
        <BrandServicesListSkeleton />
        <BrandTeamListSkeleton />
      </SafeAreaView>
    );
  }
  if (!brand && !isBrandLoading) return <NotFoundScreen />;

  return (
    <Fragment>
      {brand?.status === BrandStatus.PENDING ? (
        <BrandProfilePendingScreen onRefresh={refetchBrand} />
      ) : brand?.status === BrandStatus.SUSPENDED ? (
        <SuspendedScreen />
      ) : brand?.status === BrandStatus.WITHDRAWN ? (
        <BlockedScreen />
      ) : brand?.status === BrandStatus.REJECTED ? (
        <NotFoundScreen />
      ) : (
        <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            refreshControl={
              <RefreshControl refreshing={isBrandLoading} onRefresh={refetch} />
            }
          >
            {/* Brand Profile Card */}
            <BrandCard
              brand={brand}
              servicesCount={services?.length || 0}
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
                onAddService={() =>
                  router.push(
                    `/(slide-screens)/upsert-service?brandId=${brand.id}`,
                  )
                }
                onAddWorker={handleAddWorker}
                onManageHours={() =>
                  router.push(
                    `/(slide-screens)/upsert-schedule?brandId=${brand.id}`,
                  )
                }
              />
            )}

            {/* About Section */}
            <BrandAbout
              brand={brand}
              canEdit={canEdit}
              onEdit={handleEditBrand}
            />

            {/* Services Section */}
            <BrandServicesList
              brandId={brand.id}
              services={services}
              canEdit={canEdit}
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

          <InviteTeamSheet
            ref={inviteTeamSheetRef}
            brandId={brand.id}
            brandName={brand.brandName}
          />

          <UploadPhotosSheet
            ref={uploadPhotosSheetRef}
            onUpload={handleUploadPhotos}
          />
        </SafeAreaView>
      )}
    </Fragment>
  );
};

export default BrandProfileScreen;
