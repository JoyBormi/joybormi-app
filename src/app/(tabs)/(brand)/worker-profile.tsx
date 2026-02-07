import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
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
import { DeleteModal, DeleteModalRef } from '@/components/modals';
import { NotFoundScreen, PendingScreen } from '@/components/status-screens';
import { Button, Text } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IMAGE_CATEGORIES } from '@/constants/global.constants';
import { routes } from '@/constants/routes';
import { useGetBrandPhotos } from '@/hooks/brand';
import { useDeleteFile, useUploadFile } from '@/hooks/files';
import { useGetSchedule } from '@/hooks/schedule';
import { useGetServices } from '@/hooks/service';
import {
  useDeleteWorker,
  useGetExperiences,
  useGetWorkerProfile,
  useUpdateWorkerProfile,
} from '@/hooks/worker';
import { useUserStore } from '@/stores';
import { IFile } from '@/types/file.type';
import { EUserType } from '@/types/user.type';
import {
  DangerZone,
  ProfilePhotosGrid,
  ProfileSkeleton,
} from '@/views/profile/components';
import { useProfileGallery } from '@/views/profile/hooks/use-profile-gallery';
import { createImageUploadHandler } from '@/views/profile/utils/profile-media';
import {
  AboutSectionDisplay,
  ProfileCard,
  QuickActionsSection,
  ScheduleDisplay,
  ServicesList,
  WorkerMissing,
} from '@/views/worker-profile/components';

type WorkerProfileTab =
  | 'setup'
  | 'about'
  | 'services'
  | 'schedule'
  | 'photos'
  | 'experience'
  | 'danger';

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
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { appType } = useUserStore();

  const canEdit = appType === EUserType.WORKER;

  const {
    data: worker,
    refetch: refetchWorker,
    isLoading: isWorkerLoading,
  } = useGetWorkerProfile();
  console.log(`🚀 ~ worker:`, worker);
  const { data: services, refetch: refetchServices } = useGetServices({
    brandId: worker?.brandId,
    ownerId: worker?.id,
  });
  const { data: photos, refetch: refetchPhotos } = useGetBrandPhotos(
    worker?.brandId,
  );
  const { data: schedule, refetch: refetchSchedule } = useGetSchedule(
    worker?.brandId,
  );
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
  } = useProfileGallery({
    ownerId: worker?.id,
    ownerType: 'WORKER',
    photos,
    uploadFile,
    deleteFile,
    defaultCategory: IMAGE_CATEGORIES.other,
    fileNamePrefix: 'worker-photo',
    onRefresh: refetchPhotos,
    onErrorMessage: t('common.errors.somethingWentWrong'),
  });
  const workingDays = useMemo(() => schedule?.workingDays, [schedule]);

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
  }, [uploadBannerSheetRef]);

  const handleUploadBanner = useMemo(
    () =>
      createImageUploadHandler({
        ownerId: worker?.id,
        ownerType: 'WORKER',
        category: IMAGE_CATEGORIES.worker_cover,
        uploadFile,
        onUpdate: async (url) => {
          await updateWorkerProfile({ coverImage: url });
        },
        onErrorMessage: t('common.errors.somethingWentWrong'),
      }),
    [t, updateWorkerProfile, uploadFile, worker?.id],
  );

  const handleEditProfileImage = useCallback(() => {
    uploadProfileImageSheetRef.current?.present();
  }, [uploadProfileImageSheetRef]);

  const handleUploadProfileImage = useMemo(
    () =>
      createImageUploadHandler({
        ownerId: worker?.id,
        ownerType: 'WORKER',
        category: IMAGE_CATEGORIES.worker_avatar,
        uploadFile,
        onUpdate: async (url) => {
          await updateWorkerProfile({ avatar: url });
        },
        onErrorMessage: t('common.errors.somethingWentWrong'),
      }),
    [t, updateWorkerProfile, uploadFile, worker?.id],
  );

  const handleAddPhoto = useCallback(() => {
    uploadPhotosSheetRef.current?.present();
  }, [uploadPhotosSheetRef]);

  const handlePhotoPress = (photo: IFile) => {
    setSelectedPhoto(photo);
    uploadPhotosSheetRef.current?.present();
  };

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
    (
      filterIds?: (
        | 'details'
        | 'description'
        | 'images'
        | 'services'
        | 'photos'
        | 'schedule'
      )[],
      variant: 'inline' | 'full' = 'inline',
    ) => (
      <WorkerMissing
        {...missingProps}
        filterIds={filterIds as string[] | undefined}
        variant={variant}
      />
    ),
    [missingProps],
  );

  // Early return if no worker data

  if (isWorkerLoading) {
    return <ProfileSkeleton />;
  }
  if (!worker) return <NotFoundScreen />;

  return (
    <Fragment>
      {worker?.status === 'pending' ? (
        <PendingScreen onRefresh={refetchWorker} />
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
              <TabsList className="bg-background/95 backdrop-blur-xl border-b border-border mt-4 mb-2">
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="gap-2 px-6"
                >
                  <TabsTrigger value="setup">
                    <Text>Setup</Text>
                  </TabsTrigger>
                  <TabsTrigger value="about">
                    <Text>About</Text>
                  </TabsTrigger>
                  <TabsTrigger value="services">
                    <Text>Services</Text>
                  </TabsTrigger>
                  <TabsTrigger value="schedule">
                    <Text>Schedule</Text>
                  </TabsTrigger>
                  <TabsTrigger value="photos">
                    <Text>Photos</Text>
                  </TabsTrigger>
                  <TabsTrigger value="experience">
                    <Text>Experience</Text>
                  </TabsTrigger>
                  <TabsTrigger value="danger">
                    <Text>Danger</Text>
                  </TabsTrigger>
                </ScrollView>
              </TabsList>

              <TabsContent value="setup" className="flex-1">
                {/* Quick Actions */}
                {canEdit && (
                  <QuickActionsSection
                    onAddService={() =>
                      router.push(
                        routes.screens.upsert_service({
                          ownerId: worker.id,
                          ownerType: 'worker',
                        }),
                      )
                    }
                    onEditSchedule={() =>
                      router.push(
                        routes.screens.upsert_schedule(worker.brandId),
                      )
                    }
                  />
                )}
                {renderMissing(undefined, 'full')}
              </TabsContent>

              {/* About Section */}
              <TabsContent value="about" className="flex-1">
                {renderMissing(['details', 'description', 'images'])}
                <AboutSectionDisplay
                  worker={worker}
                  onEdit={handleEditProfile}
                  canEdit={canEdit}
                />
              </TabsContent>

              {/* Services Section */}
              <TabsContent value="services" className="flex-1">
                {renderMissing(['services'])}
                <ServicesList
                  services={services ?? []}
                  canEdit={canEdit}
                  onAddService={() =>
                    router.push(
                      routes.screens.upsert_service({
                        ownerId: worker.id,
                        ownerType: 'worker',
                      }),
                    )
                  }
                  onServicePress={(service) =>
                    router.push(
                      routes.screens.upsert_service({
                        serviceId: service.id,
                        ownerId: worker.id,
                      }),
                    )
                  }
                />
              </TabsContent>

              <TabsContent value="schedule" className="flex-1">
                {renderMissing(['schedule'])}
                <ScheduleDisplay
                  workingDays={workingDays ?? []}
                  canEdit={canEdit}
                  onEditSchedule={() =>
                    router.push(routes.screens.upsert_schedule(worker.brandId))
                  }
                />
              </TabsContent>

              {/* Photos Section */}
              <TabsContent value="photos" className="flex-1">
                {renderMissing(['photos'])}
                <ProfilePhotosGrid
                  photos={mergedPhotos}
                  canEdit={canEdit}
                  onAddPhoto={handleAddPhoto}
                  onPhotoPress={handlePhotoPress}
                />
              </TabsContent>

              <TabsContent value="experience" className="flex-1">
                <View className="px-6">
                  <View className="flex-row items-center justify-between mb-4">
                    <Text className="font-title text-lg text-foreground">
                      Experience
                    </Text>
                    {canEdit && (
                      <Button
                        size="sm"
                        variant="outline"
                        onPress={() =>
                          router.push(routes.worker.experience_history)
                        }
                      >
                        <Text>Manage</Text>
                      </Button>
                    )}
                  </View>

                  {!experiences || experiences.length === 0 ? (
                    <View className="rounded-2xl border border-border/60 bg-card/60 p-4">
                      <Text className="text-sm text-muted-foreground">
                        Add your work history to build trust with clients.
                      </Text>
                    </View>
                  ) : (
                    <View className="gap-3">
                      {experiences.slice(0, 3).map((experience) => (
                        <View
                          key={experience.id}
                          className="rounded-2xl border border-border/60 bg-card/60 p-4"
                        >
                          <Text className="font-subtitle text-foreground">
                            {experience.title}
                          </Text>
                          <Text className="text-sm text-muted-foreground">
                            {experience.company}
                          </Text>
                        </View>
                      ))}
                      {experiences.length > 3 && (
                        <Text className="text-xs text-muted-foreground">
                          +{experiences.length - 3} more experiences
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              </TabsContent>

              <TabsContent value="danger" className="flex-1">
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
            categories={WORKER_PHOTO_CATEGORIES}
          />

          <DeleteModal
            ref={deleteModalRef}
            onConfirm={async () => {
              await deleteWorker();
            }}
          />
        </SafeAreaView>
      )}
    </Fragment>
  );
};

export default WorkerProfileScreen;
