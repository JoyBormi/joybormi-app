import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { DeleteModal, DeleteModalRef } from '@/components/modals';
import { UploadAvatarSheet } from '@/components/shared/upload-avatar.sheet';
import { UploadBannerSheet } from '@/components/shared/upload-banner.sheet';
import { UploadPhotosSheet } from '@/components/shared/upload-photos.sheet';
import { NotFoundScreen, PendingScreen } from '@/components/status-screens';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { IMAGE_CATEGORIES } from '@/constants/global.constants';
import { routes } from '@/constants/routes';
import { useDeleteFile, useUploadFile } from '@/hooks/files';
import { useGetSchedule } from '@/hooks/schedule';
import { useGetServices } from '@/hooks/service';
import {
  useDeleteWorker,
  useGetExperiences,
  useGetWorkerPhotos,
  useGetWorkerProfile,
  useUpdateWorkerProfile,
} from '@/hooks/worker';
import { useUserStore } from '@/stores';
import { IFile } from '@/types/file.type';
import { ServiceOwnerType } from '@/types/service.type';
import { EUserType } from '@/types/user.type';
import {
  DangerZone,
  ProfilePhotosGrid,
  ProfileSkeleton,
  ProfileTabsBar,
} from '@/views/profile/components';
import {
  WORKER_PROFILE_PHOTO_CATEGORIES,
  WORKER_PROFILE_TABS,
  WorkerProfileTab,
} from '@/views/profile/constants';
import { useProfileGallery } from '@/views/profile/hooks/use-profile-gallery';
import {
  AboutSectionDisplay,
  ExperiencePreview,
  ProfileCard,
  QuickActionsSection,
  ScheduleDisplay,
  ServicesList,
  WorkerMissing,
} from '@/views/profile/worker';

/**
 * Worker Profile Management Page - For creators/workers to manage their worker
 * Route: /(tabs)/(worker)/worker-profile
 * This page allows editing and managing worker information
 */
const WorkerProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { appType, user } = useUserStore();

  const canEdit = appType === EUserType.WORKER;

  const {
    data: worker,
    refetch: refetchWorker,
    isLoading: isWorkerLoading,
  } = useGetWorkerProfile();
  const { data: services, refetch: refetchServices } = useGetServices({
    ownerId: worker?.id,
    ownerType: worker?.id ? ServiceOwnerType.WORKER : undefined,
  });
  const { data: photos, refetch: refetchPhotos } = useGetWorkerPhotos(
    worker?.id,
  );
  const { data: schedule, refetch: refetchSchedule } = useGetSchedule({
    brandId: worker?.brandId,
    workerId: worker?.id,
  });
  const { data: experiences } = useGetExperiences();

  // Mutations
  const { mutateAsync: uploadFile } = useUploadFile();
  const { mutateAsync: deleteFile } = useDeleteFile();
  const { mutateAsync: updateWorkerProfile } = useUpdateWorkerProfile();
  const { mutateAsync: deleteWorker, isPending: isDeleting } =
    useDeleteWorker();

  // Local state for UI
  const [activeTab, setActiveTab] = useState<WorkerProfileTab>('setup');
  const {
    selectedPhoto,
    setSelectedPhoto,
    mergedPhotos,
    handleUploadPhotos,
    handleDeletePhoto,
    handleUploadBanner,
    handleUploadProfileImage,
  } = useProfileGallery({
    ownerId: worker?.id,
    ownerType: 'WORKER',
    photos,
    uploadFile,
    deleteFile,
    defaultPhotoCategory: IMAGE_CATEGORIES.other,
    photoFileNamePrefix: 'worker-photo',
    onRefreshPhotos: refetchPhotos,
    onErrorMessage: t('common.errors.somethingWentWrong'),
    bannerCategory: IMAGE_CATEGORIES.worker_cover,
    avatarCategory: IMAGE_CATEGORIES.worker_avatar,
    onUploadBannerUrl: async (url) => {
      await updateWorkerProfile({ coverImage: url });
      refetchWorker();
      refetchPhotos();
    },
    onUploadAvatarUrl: async (url) => {
      await updateWorkerProfile({ avatar: url });
      refetchWorker();
      refetchPhotos();
    },
  });
  const workingDays = useMemo(() => schedule?.workingDays ?? [], [schedule]);

  const refetch = useCallback(() => {
    refetchWorker();
    refetchServices();
    refetchPhotos();
    refetchSchedule();
  }, [refetchWorker, refetchServices, refetchPhotos, refetchSchedule]);

  // Bottom sheet refs
  const uploadBannerSheetRef = useRef<BottomSheetModal>(null);
  const uploadProfileImageSheetRef = useRef<BottomSheetModal>(null);
  const uploadPhotosSheetRef = useRef<BottomSheetModal>(null);
  const deleteModalRef = useRef<DeleteModalRef>(null);

  // Handlers
  const handleEditProfile = useCallback(() => {
    router.push(routes.worker.edit_profile);
  }, []);

  const handleDeleteWorker = useCallback(() => {
    if (!canEdit) return;
    deleteModalRef.current?.show();
  }, [canEdit]);

  const handleEditBanner = useCallback(() => {
    uploadBannerSheetRef.current?.present();
  }, []);

  const handleEditProfileImage = useCallback(() => {
    uploadProfileImageSheetRef.current?.present();
  }, []);

  const handleAddPhoto = useCallback(() => {
    uploadPhotosSheetRef.current?.present();
  }, []);

  const handlePhotoPress = useCallback(
    (photo: IFile) => {
      setSelectedPhoto(photo);
      uploadPhotosSheetRef.current?.present();
    },
    [setSelectedPhoto],
  );

  /**
   * Photo handlers are managed by useProfileGallery
   */

  const missingProps = useMemo(
    () => ({
      canEdit,
      worker,
      services,
      mergedPhotos,
      workingDays,
      handleAddPhoto,
      handleEditWorker: handleEditProfile,
      handleEditProfileImage,
      handleEditBanner,
    }),
    [
      canEdit,
      worker,
      services,
      mergedPhotos,
      workingDays,
      handleAddPhoto,
      handleEditProfile,
      handleEditProfileImage,
      handleEditBanner,
    ],
  );

  const renderMissing = useCallback(
    (filterIds?: string[], variant: 'inline' | 'full' = 'inline') => (
      <WorkerMissing
        {...missingProps}
        filterIds={filterIds}
        variant={variant}
      />
    ),
    [missingProps],
  );

  // Early returns for loading / missing / non-active statuses
  if (isWorkerLoading) return <ProfileSkeleton />;
  if (!worker) return <NotFoundScreen />;
  if (worker.status === 'PENDING')
    return <PendingScreen onRefresh={refetchWorker} />;
  if (worker.status === 'INACTIVE') return <NotFoundScreen />;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        refreshControl={
          <RefreshControl refreshing={isWorkerLoading} onRefresh={refetch} />
        }
      >
        {/* Profile Card */}
        <ProfileCard
          worker={worker}
          servicesCount={services?.length ?? 0}
          workDaysCount={workingDays?.length ?? 0}
          photosCount={mergedPhotos.length}
          canEdit={canEdit}
          onEdit={handleEditProfile}
          onEditAvatar={handleEditProfileImage}
          onEditBanner={handleEditBanner}
        />

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as WorkerProfileTab)}
          className="flex-1"
        >
          <ProfileTabsBar tabs={WORKER_PROFILE_TABS} />

          <TabsContent value="setup" className="flex-1">
            {renderMissing(undefined, 'full')}

            {/* Quick Actions */}
            {canEdit && (
              <QuickActionsSection
                onAddService={() =>
                  router.push(routes.screens.upsert_service())
                }
                onJoinBrand={
                  user?.role === EUserType.CREATOR
                    ? undefined
                    : () => router.push(routes.worker.invite_code)
                }
                onEditSchedule={() =>
                  router.push(
                    routes.screens.upsert_schedule({
                      brandId: worker.brandId,
                      workerId: worker.id,
                    }),
                  )
                }
              />
            )}
          </TabsContent>

          {/* About Section */}
          <TabsContent value="about" className="flex-1 min-h-[50vh]">
            {renderMissing(['details', 'description', 'images'])}
            <AboutSectionDisplay
              worker={worker}
              onEdit={handleEditProfile}
              canEdit={canEdit}
            />
          </TabsContent>

          {/* Services Section */}
          <TabsContent value="services" className="flex-1 min-h-[50vh]">
            {renderMissing(['services'])}
            <ServicesList
              services={services ?? []}
              canEdit={canEdit}
              onAddService={() => router.push(routes.screens.upsert_service())}
              onServicePress={(service) =>
                router.push(
                  routes.screens.upsert_service({
                    serviceId: service.id,
                  }),
                )
              }
            />
          </TabsContent>

          <TabsContent value="schedule" className="flex-1 min-h-[50vh]">
            {renderMissing(['schedule'])}
            <ScheduleDisplay
              workingDays={workingDays ?? []}
              canEdit={canEdit}
              onEditSchedule={() =>
                router.push(
                  routes.screens.upsert_schedule({
                    brandId: worker.brandId,
                    workerId: worker.id,
                  }),
                )
              }
            />
          </TabsContent>

          {/* Photos Section */}
          <TabsContent value="photos" className="flex-1 min-h-[50vh]">
            {renderMissing(['photos'])}
            <ProfilePhotosGrid
              photos={mergedPhotos}
              canEdit={canEdit}
              onAddPhoto={handleAddPhoto}
              onPhotoPress={handlePhotoPress}
            />
          </TabsContent>

          <TabsContent value="experience" className="flex-1 min-h-[50vh]">
            <ExperiencePreview experiences={experiences} canEdit={canEdit} />
          </TabsContent>

          <TabsContent value="danger" className="flex-1 min-h-[50vh]">
            <DangerZone
              description="Deleting your worker profile is permanent. This removes your availability, services, and portfolio photos."
              actionTitle="Delete worker profile"
              actionDescription="You will lose access to your worker data and reviews."
              actionLabel="Delete Worker"
              onPress={handleDeleteWorker}
              disabled={!canEdit || isDeleting}
            />
          </TabsContent>
        </Tabs>
      </ScrollView>

      {/* *****************************************************************
       * Secondary Sheets
       * ***************************************************************** */}
      <UploadBannerSheet
        ref={uploadBannerSheetRef}
        currentBanner={worker.coverImage || ''}
        onUpload={handleUploadBanner}
      />

      <UploadAvatarSheet
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
        categories={WORKER_PROFILE_PHOTO_CATEGORIES}
      />

      <DeleteModal
        ref={deleteModalRef}
        onConfirm={async () => {
          await deleteWorker();
        }}
      />
    </SafeAreaView>
  );
};

export default WorkerProfileScreen;
