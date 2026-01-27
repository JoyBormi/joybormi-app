import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { Fragment, useMemo, useRef, useState } from 'react';
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
} from '@/components/brand-worker';
import {
  BlockedScreen,
  NotFoundScreen,
  PendingScreen,
  SuspendedScreen,
} from '@/components/status-screens';
import { Skeleton } from '@/components/ui';
import {
  useGetBrand,
  useGetBrandPhotos,
  useGetBrandTeam,
  useUpdateBrand,
} from '@/hooks/brand';
import { useUploadFile, useUploadMultipleFiles } from '@/hooks/common';
import { useGetSchedule } from '@/hooks/schedule';
import { useGetServices } from '@/hooks/service';
import { useUserStore } from '@/stores';
import { BrandStatus, type IBrandPhoto } from '@/types/brand.type';
import { EUserType } from '@/types/user.type';
import { type UploadedFile } from '@/utils/file-upload';
import {
  BrandAbout,
  BrandCard,
  BrandPhotosGrid,
  BrandQuickActions,
  BrandServicesList,
  BrandTeamList,
} from '@/views/brand-profile/components';
import { ScheduleDisplay } from '@/views/worker-profile/components';

import type { IWorker } from '@/types/worker.type';

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

  const {
    data: brand,
    refetch: refetchBrand,
    isLoading: isBrandProfileLoading,
  } = useGetBrand(user?.id, appType);
  const { data: services, refetch: refetchServices } = useGetServices({
    brandId: brand?.id,
  });
  const { data: team, refetch: refetchTeam } = useGetBrandTeam({
    brandId: brand?.id,
  });
  const { data: photos, refetch: refetchPhotos } = useGetBrandPhotos({
    brandId: brand?.id,
  });
  const { data: schedule, refetch: refetchSchedule } = useGetSchedule({
    brandId: brand?.id,
  });

  // Mutations
  const updateBrandMutation = useUpdateBrand(brand?.id || '');
  const uploadFileMutation = useUploadFile();
  const uploadMultipleFilesMutation = useUploadMultipleFiles();

  // Local state for UI
  const [localPhotos, setLocalPhotos] = useState<IBrandPhoto[]>([]);
  const mergedPhotos = useMemo(
    () => [...localPhotos, ...(photos ?? [])],
    [localPhotos, photos],
  );
  const workers = team ?? [];
  const workingDays = schedule?.workingDays ?? [];

  const refetch = () => {
    refetchBrand();
    refetchServices();
    refetchTeam();
    refetchPhotos();
    refetchSchedule();
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

  const buildUploadedFile = (uri: string, label: string): UploadedFile => {
    const name = uri.split('/').pop() || `${label}-${Date.now()}.jpg`;
    return {
      uri,
      name,
      type: 'image/jpeg',
    };
  };

  const handleUploadBanner = async (uri: string) => {
    if (!brand?.id) return;

    try {
      const file = buildUploadedFile(uri, 'brand-banner');
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
      const file = buildUploadedFile(uri, 'brand-avatar');
      const { url } = await uploadFileMutation.mutateAsync({ file });
      await updateBrandMutation.mutateAsync({ profileImage: url });
    } catch (error) {
      console.error('Failed to upload profile image:', error);
    }
  };

  const handleAddWorker = () => {
    inviteTeamSheetRef.current?.present();
  };

  const handleWorkerPress = (worker: IWorker) => {
    router.push(`/(dynamic-brand)/team/worker/${worker.id}`);
  };

  const handleAddPhoto = () => {
    uploadPhotosSheetRef.current?.present();
  };

  const handlePhotoPress = () => {
    uploadPhotosSheetRef.current?.present();
  };

  const handleUploadPhotos = async (
    newPhotos: { uri: string; category: string }[],
  ) => {
    if (!brand?.id || newPhotos.length === 0) return;

    try {
      const files = newPhotos.map((photo, index) =>
        buildUploadedFile(photo.uri, `brand-photo-${index}`),
      );
      const { urls } = await uploadMultipleFilesMutation.mutateAsync({
        files,
      });
      const photosToAdd: IBrandPhoto[] = urls.map((url, index) => ({
        id: `photo-${Date.now()}-${index}`,
        url,
        category: (newPhotos[index]?.category ??
          'other') as IBrandPhoto['category'],
        uploadedAt: new Date().toISOString(),
      }));
      setLocalPhotos((prev) => [...photosToAdd, ...prev]);
    } catch (error) {
      console.error('Failed to upload photos:', error);
    }
  };

  // Early return if no brand data

  if (isBrandProfileLoading) {
    return (
      <SafeAreaView className="main-area" edges={['top']}>
        {/* Section Skeletons */}
        <Skeleton className="h-64" />
      </SafeAreaView>
    );
  }
  if (!brand) return <NotFoundScreen />;

  return (
    <Fragment>
      {brand?.status === BrandStatus.PENDING ? (
        <PendingScreen onRefresh={refetchBrand} />
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
              <RefreshControl
                refreshing={isBrandProfileLoading}
                onRefresh={refetch}
              />
            }
          >
            {/* Brand Profile Card */}
            <BrandCard
              brand={brand}
              servicesCount={services?.length || 0}
              workersCount={workers.length}
              photosCount={mergedPhotos.length}
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

            <ScheduleDisplay
              workingDays={workingDays}
              onEditSchedule={() =>
                router.push(
                  `/(slide-screens)/upsert-schedule?brandId=${brand.id}`,
                )
              }
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
              photos={mergedPhotos}
              canEdit={canEdit}
              onAddPhoto={handleAddPhoto}
              onPhotoPress={handlePhotoPress}
            />

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
