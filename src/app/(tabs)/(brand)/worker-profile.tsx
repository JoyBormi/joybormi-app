import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {
  UploadBannerSheet,
  UploadPhotosSheet,
  UploadProfileImageSheet,
} from '@/components/brand-worker';
import { NotFoundScreen, PendingScreen } from '@/components/status-screens';
import { Skeleton } from '@/components/ui';
import {
  useGetBrandPhotos,
  useGetBrandTeam,
  useUpdateBrand,
} from '@/hooks/brand';
import { normalizeFileUrl, useUploadFile } from '@/hooks/files';
import { useGetSchedule } from '@/hooks/schedule';
import { useGetServices } from '@/hooks/service';
import { useGetWorkerProfile } from '@/hooks/worker';
import { buildUploadedFile } from '@/lib/utils';
import { useUserStore } from '@/stores';
import { type IBrandPhoto } from '@/types/brand.type';
import { EUserType } from '@/types/user.type';
import {
  BrandMissing,
  BrandPhotosGrid,
  BrandQuickActions,
  BrandServicesList,
  BrandTeamList,
} from '@/views/brand-profile/components';
import {
  AboutSectionDisplay,
  ProfileCard,
  ScheduleDisplay,
} from '@/views/worker-profile/components';

import type { IWorker } from '@/types/worker.type';

/**
 * Worker Profile Management Page - For creators/workers to manage their worker
 * Route: /(tabs)/(worker)/worker-profile
 * This page allows editing and managing worker information
 */
const WorkerProfileScreen: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { appType, user } = useUserStore();

  // Check if user is creator or worker
  const isCreator = appType === EUserType.CREATOR;
  const canEdit = isCreator;

  const {
    data: worker,
    refetch: refetchWorker,
    isLoading: isWorkerLoading,
  } = useGetWorkerProfile({
    userId: user?.id,
  });
  const {
    data: services,
    refetch: refetchServices,
    isLoading: isServicesLoading,
  } = useGetServices({
    brandId: worker?.brandId,
    ownerId: user?.id,
  });
  const { data: team, refetch: refetchTeam } = useGetBrandTeam({
    brandId: worker?.id,
  });
  const { data: photos, refetch: refetchPhotos } = useGetBrandPhotos({
    brandId: worker?.id,
  });
  const { data: schedule, refetch: refetchSchedule } = useGetSchedule({
    brandId: worker?.id,
  });

  // Mutations
  const { mutateAsync: updateBrand } = useUpdateBrand();
  const { mutateAsync: uploadFile, isPending: isUploadingFile } =
    useUploadFile();

  // Local state for UI
  const [localPhotos, setLocalPhotos] = useState<IBrandPhoto[]>([]);
  const mergedPhotos = useMemo(
    () => [...localPhotos, ...(photos ?? [])],
    [localPhotos, photos],
  );
  const workers = team ?? [];
  const workingDays = schedule?.workingDays ?? [];

  const refetch = () => {
    refetchWorker();
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
    router.push('/(screens)/edit-worker-profile');
  }, [router]);

  const handleEditBanner = useCallback(() => {
    uploadBannerSheetRef.current?.present();
  }, [uploadBannerSheetRef]);

  const handleUploadBanner = async (uri: string) => {
    if (!worker?.id) return;

    try {
      const file = buildUploadedFile(uri, 'worker-banner');
      const uploadedFile = await uploadFile({
        file,
        category: 'worker-banner',
        description: 'Brand banner image',
      });

      if (!uploadedFile.url) {
        throw new Error(t('errors.uploadFailed'));
      }

      const bannerUrl = normalizeFileUrl(uploadedFile.url);

      if (!bannerUrl) {
        throw new Error(t('errors.uploadFailed'));
      }

      console.log(
        '🚀 ~ handleUploadBanner ~ bannerUrl:',
        bannerUrl,
        uploadedFile,
      );

      await updateBrand({ brandId: worker.id, bannerImage: bannerUrl });
    } catch (error) {
      console.error('Failed to upload banner:', error);
    }
  };

  const handleEditProfileImage = useCallback(() => {
    uploadProfileImageSheetRef.current?.present();
  }, [uploadProfileImageSheetRef]);

  const handleUploadProfileImage = async (uri: string) => {
    if (!worker?.id) return;

    try {
      const file = buildUploadedFile(uri, 'worker-avatar');
      const uploadedFile = await uploadFile({
        file,
        category: 'worker-avatar',
        description: 'Brand profile image',
      });
      if (!uploadedFile.url) {
        throw new Error(t('errors.uploadFailed'));
      }

      const profileUrl = normalizeFileUrl(uploadedFile.url);

      if (!profileUrl) {
        throw new Error(t('errors.uploadFailed'));
      }
      await updateBrand({ brandId: worker.id, profileImage: profileUrl });
    } catch (error) {
      console.error('Failed to upload profile image:', error);
    }
  };

  const handleAddWorker = useCallback(() => {
    inviteTeamSheetRef.current?.present();
  }, [inviteTeamSheetRef]);

  const handleWorkerPress = useCallback(
    (worker: IWorker) => {
      router.push(`/(dynamic-worker)/team/worker/${worker.id}`);
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
    if (!worker?.id || newPhotos.length === 0) return;

    try {
      const uploadResults = await Promise.all(
        newPhotos.map((photo, index) =>
          uploadFile({
            file: buildUploadedFile(photo.uri, `worker-photo-${index}`),
            category: photo.category ?? 'other',
            description: 'Brand gallery photo',
          }),
        ),
      );
      const photosToAdd: IBrandPhoto[] = uploadResults
        .map((uploadedFile, index) => {
          const url = normalizeFileUrl(uploadedFile.url!);
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

  // Early return if no worker data

  if (isWorkerLoading) {
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
  if (!worker) return <NotFoundScreen />;

  return (
    <Fragment>
      {worker?.status === 'pending' ? (
        <PendingScreen />
      ) : worker?.status === 'inactive' ? (
        <NotFoundScreen />
      ) : (
        <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            refreshControl={
              <RefreshControl
                refreshing={isWorkerLoading}
                onRefresh={refetch}
              />
            }
          >
            {/* Profile Card */}
            <ProfileCard
              worker={worker}
              servicesCount={services?.length || 0}
              workDaysCount={workingDays.length}
              reviewsCount={0}
              // onEdit={handleEditProfile}
              // onAvatarChange={handleAvatarChange}
              // onBannerChange={handleBannerChange}
            />

            {/* Quick Actions */}
            {canEdit && (
              <BrandQuickActions
                onAddService={() =>
                  router.push(
                    `/(slide-screens)/upsert-service?ownerId=${worker.id}&ownerType=worker`,
                  )
                }
                onAddWorker={handleAddWorker}
                onManageHours={() =>
                  router.push(`/(screens)/upsert-schedule?brandId=${worker.id}`)
                }
              />
            )}

            <BrandMissing
              canEdit={canEdit}
              worker={worker}
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
            <AboutSectionDisplay worker={worker} onEdit={handleEditBrand} />

            {/* Services Section */}
            <BrandServicesList
              ownerId={worker.id}
              services={services}
              canEdit={canEdit}
            />

            <ScheduleDisplay
              workingDays={workingDays}
              onEditSchedule={() =>
                router.push(`/(screens)/upsert-schedule?brandId=${worker.id}`)
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
            currentBanner={worker.coverImage || ''}
            onUpload={handleUploadBanner}
          />

          <UploadProfileImageSheet
            ref={uploadProfileImageSheetRef}
            currentImage={worker.avatar || ''}
            onUpload={handleUploadProfileImage}
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

export default WorkerProfileScreen;
