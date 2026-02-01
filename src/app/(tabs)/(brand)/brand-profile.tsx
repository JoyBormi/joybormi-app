import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
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
import { getFileUrl, useUploadFile } from '@/hooks/files';
import { useGetSchedule } from '@/hooks/schedule';
import { useGetServices } from '@/hooks/service';
import { buildUploadedFile } from '@/lib/utils';
import { useUserStore } from '@/stores';
import { BrandStatus, type IBrandPhoto } from '@/types/brand.type';
import { EUserType } from '@/types/user.type';
import {
  BrandAbout,
  BrandCard,
  BrandMissing,
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
  const { appType } = useUserStore();

  // Check if user is creator or worker
  const isCreator = appType === EUserType.CREATOR;
  const canEdit = isCreator;

  const { data: brand, refetch: refetchBrand, isLoading } = useGetBrand();
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
  const { mutateAsync: updateBrand } = useUpdateBrand();
  const { mutateAsync: uploadFile } = useUploadFile();

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
  const handleEditBrand = useCallback(() => {
    router.push('/(screens)/edit-brand-profile');
  }, [router]);

  const handleEditBanner = useCallback(() => {
    uploadBannerSheetRef.current?.present();
  }, [uploadBannerSheetRef]);

  const handleUploadBanner = async (uri: string) => {
    if (!brand?.id) return;

    try {
      const file = buildUploadedFile(uri, 'brand-banner');
      const uploadedFile = await uploadFile({
        file,
        category: 'brand-banner',
        description: 'Brand banner image',
      });
      const bannerUrl = getFileUrl(uploadedFile);
      if (!bannerUrl) {
        throw new Error('Upload did not return a banner URL');
      }
      await updateBrand({ brandId: brand.id, bannerImage: bannerUrl });
    } catch (error) {
      console.error('Failed to upload banner:', error);
    }
  };

  const handleEditProfileImage = useCallback(() => {
    uploadProfileImageSheetRef.current?.present();
  }, [uploadProfileImageSheetRef]);

  const handleUploadProfileImage = async (uri: string) => {
    if (!brand?.id) return;

    try {
      const file = buildUploadedFile(uri, 'brand-avatar');
      const uploadedFile = await uploadFile({
        file,
        category: 'brand-avatar',
        description: 'Brand profile image',
      });
      const profileUrl = getFileUrl(uploadedFile);
      if (!profileUrl) {
        throw new Error('Upload did not return a profile image URL');
      }
      await updateBrand({ brandId: brand.id, profileImage: profileUrl });
    } catch (error) {
      console.error('Failed to upload profile image:', error);
    }
  };

  const handleAddWorker = useCallback(() => {
    inviteTeamSheetRef.current?.present();
  }, [inviteTeamSheetRef]);

  const handleWorkerPress = useCallback(
    (worker: IWorker) => {
      router.push(`/(dynamic-brand)/team/worker/${worker.id}`);
    },
    [router],
  );

  const handleAddPhoto = useCallback(() => {
    uploadPhotosSheetRef.current?.present();
  }, [uploadPhotosSheetRef]);

  const handlePhotoPress = () => {
    uploadPhotosSheetRef.current?.present();
  };

  const handleUploadPhotos = async (
    newPhotos: { uri: string; category: string }[],
  ) => {
    if (!brand?.id || newPhotos.length === 0) return;

    try {
      const uploadResults = await Promise.all(
        newPhotos.map((photo, index) =>
          uploadFile({
            file: buildUploadedFile(photo.uri, `brand-photo-${index}`),
            category: photo.category ?? 'other',
            description: 'Brand gallery photo',
          }),
        ),
      );
      const photosToAdd: IBrandPhoto[] = uploadResults
        .map((uploadedFile, index) => {
          const url = getFileUrl(uploadedFile);
          if (!url) return null;
          return {
            id: uploadedFile.id ?? `photo-${Date.now()}-${index}`,
            url,
            category: (newPhotos[index]?.category ??
              'other') as IBrandPhoto['category'],
            uploadedAt: new Date().toISOString(),
          };
        })
        .filter((photo): photo is IBrandPhoto => Boolean(photo));
      if (photosToAdd.length > 0) {
        setLocalPhotos((prev) => [...photosToAdd, ...prev]);
      }
    } catch (error) {
      console.error('Failed to upload photos:', error);
    }
  };

  // Early return if no brand data

  if (isLoading) {
    return (
      <SafeAreaView className="main-area" edges={['top']}>
        <View className="gap-6 pt-4">
          <Skeleton className="h-48 rounded-3xl" />
          <View className="gap-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
          </View>
          <View className="gap-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-24 rounded-2xl" />
          </View>
          <View className="gap-3">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-32 rounded-2xl" />
          </View>
        </View>
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
              <RefreshControl refreshing={isLoading} onRefresh={refetch} />
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
                  router.push(`/(screens)/upsert-schedule?brandId=${brand.id}`)
                }
              />
            )}

            <BrandMissing
              canEdit={canEdit}
              brand={brand}
              workers={workers}
              services={services}
              mergedPhotos={mergedPhotos}
              workingDays={workingDays}
              handleAddPhoto={handleAddPhoto}
              handleAddWorker={handleAddWorker}
              handleEditBrand={handleEditBrand}
              handleEditProfileImage={handleEditProfileImage}
              handleEditBanner={handleEditBanner}
            />

            {/* About Section */}
            <BrandAbout
              brand={brand}
              canEdit={canEdit}
              onEdit={handleEditBrand}
            />

            {/* Services Section */}
            <BrandServicesList
              ownerId={brand.id}
              services={services}
              canEdit={canEdit}
            />

            <ScheduleDisplay
              workingDays={workingDays}
              onEditSchedule={() =>
                router.push(`/(screens)/upsert-schedule?brandId=${brand.id}`)
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
