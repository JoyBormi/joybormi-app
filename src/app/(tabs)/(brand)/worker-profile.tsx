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
import { IMAGE_CATEGORIES } from '@/constants/global.constants';
import { useGetBrandPhotos } from '@/hooks/brand';
import {
  normalizeFileUrl,
  useDeleteFile,
  useUpdateFileMetadata,
  useUploadFile,
} from '@/hooks/files';
import { useGetSchedule } from '@/hooks/schedule';
import { useGetServices } from '@/hooks/service';
import { useGetWorkerProfile, useUpdateWorkerProfile } from '@/hooks/worker';
import { buildUploadedFile } from '@/lib/utils';
import { toast } from '@/providers/toaster';
import { useUserStore } from '@/stores';
import { IFile } from '@/types/file.type';
import { EUserType } from '@/types/user.type';
import { ProfilePhotosGrid, ProfileSkeleton } from '@/views/profile/components';
import {
  AboutSectionDisplay,
  ProfileCard,
  QuickActionsSection,
  ScheduleDisplay,
  ServicesList,
  WorkerMissing,
} from '@/views/worker-profile/components';

const WORKER_PHOTO_CATEGORIES = [
  {
    value: IMAGE_CATEGORIES.worker_portfolio,
    label: 'Portfolio',
    icon: 'Camera',
  },
  {
    value: IMAGE_CATEGORIES.worker_certificates,
    label: 'Certificates',
    icon: 'Shield',
  },
  {
    value: IMAGE_CATEGORIES.worker_workspace,
    label: 'Workspace',
    icon: 'Home',
  },
  { value: IMAGE_CATEGORIES.other, label: 'Other', icon: 'Image' },
];

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

  const canEdit = appType === EUserType.CREATOR || appType === EUserType.WORKER;

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
  const { data: photos, refetch: refetchPhotos } = useGetBrandPhotos(
    worker?.brandId,
  );
  const { data: schedule, refetch: refetchSchedule } = useGetSchedule({
    brandId: worker?.brandId,
  });

  // Mutations
  const { mutateAsync: uploadFile } = useUploadFile();
  const { mutateAsync: deleteFile } = useDeleteFile();
  const { mutateAsync: updateFileMetadata } = useUpdateFileMetadata();
  const { mutateAsync: updateWorkerProfile } = useUpdateWorkerProfile(
    worker?.id ?? '',
  );

  // Local state for UI
  const [selectedPhoto, setSelectedPhoto] = useState<IFile | null>(null);
  const [localPhotos, setLocalPhotos] = useState<IFile[]>([]);
  const mergedPhotos = useMemo(
    () => [...localPhotos, ...(photos ?? [])],
    [localPhotos, photos],
  );
  const workingDays = schedule?.workingDays ?? [];

  const refetch = () => {
    refetchWorker();
    refetchServices();
    refetchPhotos();
    refetchSchedule();
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
      const file = buildUploadedFile(uri, IMAGE_CATEGORIES.worker_cover);
      const uploadedFile = await uploadFile({
        file,
        category: IMAGE_CATEGORIES.worker_cover,
        description: 'Worker banner image',
        userId: user?.id,
      });

      if (!uploadedFile.url) {
        throw new Error(t('errors.uploadFailed'));
      }

      const bannerUrl = normalizeFileUrl(uploadedFile.url);

      if (!bannerUrl) {
        throw new Error(t('errors.uploadFailed'));
      }

      await updateWorkerProfile({ coverImage: bannerUrl });
    } catch {
      toast.error({ title: t('common.errors.somethingWentWrong') });
    }
  };

  const handleEditProfileImage = useCallback(() => {
    uploadProfileImageSheetRef.current?.present();
  }, [uploadProfileImageSheetRef]);

  const handleUploadProfileImage = async (uri: string) => {
    if (!worker?.id) return;

    try {
      const file = buildUploadedFile(uri, IMAGE_CATEGORIES.worker_avatar);
      const uploadedFile = await uploadFile({
        file,
        category: IMAGE_CATEGORIES.worker_avatar,
        description: 'Worker profile image',
        userId: user?.id,
      });
      if (!uploadedFile.url) {
        throw new Error(t('errors.uploadFailed'));
      }

      const profileUrl = normalizeFileUrl(uploadedFile.url);

      if (!profileUrl) {
        throw new Error(t('errors.uploadFailed'));
      }
      await updateWorkerProfile({ avatar: profileUrl });
    } catch {
      toast.error({ title: t('common.errors.somethingWentWrong') });
    }
  };

  const handleAddPhoto = useCallback(() => {
    uploadPhotosSheetRef.current?.present();
  }, [uploadPhotosSheetRef]);

  const handlePhotoPress = (photo: IFile) => {
    setSelectedPhoto(photo);
    uploadPhotosSheetRef.current?.present();
  };

  const handleUploadPhotos = async (
    newPhotos: { uri: string; category: string }[],
  ) => {
    if (!worker?.id || !user || newPhotos.length === 0) return;

    try {
      const uploadResults = await Promise.all(
        newPhotos.map((photo, index) =>
          uploadFile({
            file: buildUploadedFile(photo.uri, `worker-photo-${index}`),
            category: photo.category ?? IMAGE_CATEGORIES.other,
            description: 'Worker gallery photo',
            userId: user.id,
          }),
        ),
      );
      const photosToAdd = uploadResults
        .map((uploadedFile, index) => {
          const url = normalizeFileUrl(uploadedFile.url!);
          if (!url) return null;
          return {
            id: uploadedFile.id ?? `photo-${Date.now()}-${index}`,
            url,
            category: (newPhotos[index]?.category ??
              IMAGE_CATEGORIES.other) as IFile['category'],
            uploadedAt: new Date().toISOString(),
          };
        })
        .filter((photo): photo is IFile => Boolean(photo));
      if (photosToAdd.length > 0) {
        setLocalPhotos((prev) => [...photosToAdd, ...prev]);
      }
    } catch {
      toast.error({ title: t('common.errors.somethingWentWrong') });
    }
  };

  const handleDeletePhoto = async (fileId: string) => {
    if (!worker?.id || !fileId) return;
    try {
      await deleteFile(fileId);
      refetchPhotos();
    } catch {
      toast.error({ title: t('common.errors.somethingWentWrong') });
    }
  };

  const handleReplacePhoto = async (fileId: string) => {
    if (!worker?.id || !fileId || !user) return;
    try {
      await updateFileMetadata({
        id: fileId,
        payload: {
          category: IMAGE_CATEGORIES.other,
          description: 'Worker gallery photo',
          userId: user.id,
        },
      });
      refetchPhotos();
    } catch {
      toast.error({ title: t('common.errors.somethingWentWrong') });
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
              photosCount={mergedPhotos.length}
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

            <WorkerMissing
              canEdit={canEdit}
              worker={worker}
              services={services}
              mergedPhotos={mergedPhotos}
              workingDays={workingDays}
              handleAddPhoto={handleAddPhoto}
              handleEditWorker={handleEditProfile}
              handleEditProfileImage={handleEditProfileImage}
              handleEditBanner={handleEditBanner}
            />

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

            {/* Photos Section */}
            <ProfilePhotosGrid
              photos={mergedPhotos}
              canEdit={canEdit}
              onAddPhoto={handleAddPhoto}
              onPhotoPress={handlePhotoPress}
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
            value={selectedPhoto}
            setValue={setSelectedPhoto}
            onUpload={handleUploadPhotos}
            onDelete={handleDeletePhoto}
            onReplace={handleReplacePhoto}
            categories={WORKER_PHOTO_CATEGORIES}
          />
        </SafeAreaView>
      )}
    </Fragment>
  );
};

export default WorkerProfileScreen;
