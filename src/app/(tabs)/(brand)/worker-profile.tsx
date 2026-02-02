import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
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
import { useGetBrandPhotos } from '@/hooks/brand';
import { normalizeFileUrl, useUploadFile } from '@/hooks/files';
import { useGetSchedule } from '@/hooks/schedule';
import { useGetServices } from '@/hooks/service';
import {
  useGetWorkerProfile,
  useGetWorkerReviews,
  useUpdateWorkerProfile,
} from '@/hooks/worker';
import { buildUploadedFile } from '@/lib/utils';
import { useUserStore } from '@/stores';
import { type IBrandPhoto } from '@/types/brand.type';
import { EUserType } from '@/types/user.type';
import { ProfilePhotosGrid, ProfileSkeleton } from '@/views/profile/components';
import {
  AboutSectionDisplay,
  ProfileCard,
  QuickActionsSection,
  ReviewsList,
  ScheduleDisplay,
  ServicesList,
} from '@/views/worker-profile/components';

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
  const { data: services, refetch: refetchServices } = useGetServices({
    brandId: worker?.brandId,
    ownerId: worker?.id,
  });
  const { data: photos, refetch: refetchPhotos } = useGetBrandPhotos({
    brandId: worker?.brandId,
  });
  const { data: schedule, refetch: refetchSchedule } = useGetSchedule({
    brandId: worker?.brandId,
  });
  const { data: reviews, refetch: refetchReviews } = useGetWorkerReviews({
    workerId: worker?.id,
  });

  // Mutations
  const { mutateAsync: uploadFile } = useUploadFile();
  const { mutateAsync: updateWorkerProfile } = useUpdateWorkerProfile(
    worker?.id ?? '',
  );

  // Local state for UI
  const [localPhotos, setLocalPhotos] = useState<IBrandPhoto[]>([]);
  const mergedPhotos = useMemo(
    () => [...localPhotos, ...(photos ?? [])],
    [localPhotos, photos],
  );
  const workingDays = schedule?.workingDays ?? [];
  const workerReviews = reviews ?? [];

  const refetch = () => {
    refetchWorker();
    refetchServices();
    refetchPhotos();
    refetchSchedule();
    refetchReviews();
  };

  // Bottom sheet refs
  const uploadBannerSheetRef = useRef<BottomSheetModal>(null);
  const uploadProfileImageSheetRef = useRef<BottomSheetModal>(null);
  const uploadPhotosSheetRef = useRef<BottomSheetModal>(null);

  // Handlers
  const handleEditProfile = useCallback(() => {
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
        description: 'Worker banner image',
      });

      if (!uploadedFile.url) {
        throw new Error(t('errors.uploadFailed'));
      }

      const bannerUrl = normalizeFileUrl(uploadedFile.url);

      if (!bannerUrl) {
        throw new Error(t('errors.uploadFailed'));
      }

      await updateWorkerProfile({ coverImage: bannerUrl });
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
        description: 'Worker profile image',
      });
      if (!uploadedFile.url) {
        throw new Error(t('errors.uploadFailed'));
      }

      const profileUrl = normalizeFileUrl(uploadedFile.url);

      if (!profileUrl) {
        throw new Error(t('errors.uploadFailed'));
      }
      await updateWorkerProfile({ avatar: profileUrl });
    } catch (error) {
      console.error('Failed to upload profile image:', error);
    }
  };

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
    return <ProfileSkeleton />;
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
              reviewsCount={workerReviews.length}
              canEdit={canEdit}
              onEdit={handleEditProfile}
              onEditAvatar={handleEditProfileImage}
              onEditBanner={handleEditBanner}
            />

            {/* Quick Actions */}
            {canEdit && (
              <QuickActionsSection
                onAddService={() =>
                  router.push(
                    `/(slide-screens)/upsert-service?ownerId=${worker.id}&ownerType=worker`,
                  )
                }
                onEditSchedule={() =>
                  router.push(
                    `/(screens)/upsert-schedule?brandId=${worker.brandId}`,
                  )
                }
              />
            )}

            {/* About Section */}
            <AboutSectionDisplay
              worker={worker}
              onEdit={handleEditProfile}
              canEdit={canEdit}
            />

            {/* Services Section */}
            <ServicesList
              services={services ?? []}
              canEdit={canEdit}
              onAddService={() =>
                router.push(
                  `/(slide-screens)/upsert-service?ownerId=${worker.id}&ownerType=worker`,
                )
              }
              onServicePress={(service) =>
                router.push(
                  `/(slide-screens)/upsert-service?serviceId=${service.id}&ownerId=${worker.id}`,
                )
              }
            />

            <ScheduleDisplay
              workingDays={workingDays}
              canEdit={canEdit}
              onEditSchedule={() =>
                router.push(
                  `/(screens)/upsert-schedule?brandId=${worker.brandId}`,
                )
              }
            />

            {/* Reviews Section */}
            <ReviewsList reviews={workerReviews} maxDisplay={2} />

            {/* Photos Section */}
            <ProfilePhotosGrid
              photos={mergedPhotos}
              canEdit={canEdit}
              onAddPhoto={handleAddPhoto}
              onPhotoPress={handlePhotoPress}
              title="Portfolio"
            />
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
