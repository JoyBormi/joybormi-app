import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
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
import { Text } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IMAGE_CATEGORIES } from '@/constants/global.constants';
import { routes } from '@/constants/routes';
import { useGetBrandPhotos } from '@/hooks/brand';
import { normalizeFileUrl, useDeleteFile, useUploadFile } from '@/hooks/files';
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

type WorkerProfileTab = 'setup' | 'about' | 'services' | 'schedule' | 'photos';

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

  // Mutations
  const { mutateAsync: uploadFile } = useUploadFile();
  const { mutateAsync: deleteFile } = useDeleteFile();
  const { mutateAsync: updateWorkerProfile } = useUpdateWorkerProfile();

  // Local state for UI
  const [activeTab, setActiveTab] = useState<WorkerProfileTab>('setup');
  const [selectedPhoto, setSelectedPhoto] = useState<IFile | null>(null);
  const [localPhotos, setLocalPhotos] = useState<IFile[]>([]);
  const mergedPhotos = useMemo(
    () => [...localPhotos, ...(photos ?? [])],
    [localPhotos, photos],
  );
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

  // Handlers
  const handleEditProfile = useCallback(() => {
    router.push(routes.worker.edit_profile);
  }, []);

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
        ownerId: worker.id,
        ownerType: 'WORKER',
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
        ownerId: worker.id,
        ownerType: 'WORKER',
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
    if (!worker?.id || newPhotos.length === 0) return;

    try {
      const uploadResults = await Promise.all(
        newPhotos.map((photo, index) =>
          uploadFile({
            file: buildUploadedFile(photo.uri, `worker-photo-${index}`),
            category: photo.category ?? IMAGE_CATEGORIES.other,
            ownerId: worker.id,
            ownerType: 'WORKER',
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
        .filter((photo) => Boolean(photo));
      if (photosToAdd.length > 0) {
        setLocalPhotos((prev) => [...photosToAdd, ...prev] as IFile[]);
      }

      if (selectedPhoto?.id) {
        await deleteFile(selectedPhoto.id);
        setSelectedPhoto(null);
        refetchPhotos();
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
        </SafeAreaView>
      )}
    </Fragment>
  );
};

export default WorkerProfileScreen;
