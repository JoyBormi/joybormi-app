import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { DeleteModal, DeleteModalRef } from '@/components/modals';
import {
  NotFoundScreen,
  PendingScreen,
  SuspendedScreen,
} from '@/components/status-screens';
import { Text } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IMAGE_CATEGORIES } from '@/constants/global.constants';
import { routes } from '@/constants/routes';
import {
  useDeleteBrand,
  useGetBrand,
  useGetBrandPhotos,
  useGetBrandTeam,
  useUpdateBrand,
} from '@/hooks/brand';
import { useDeleteFile, useUploadFile } from '@/hooks/files';
import { useGetSchedule } from '@/hooks/schedule';
import { useGetServices } from '@/hooks/service';
import { useUserStore } from '@/stores';
import { BrandStatus } from '@/types/brand.type';
import { IFile } from '@/types/file.type';
import { ServiceOwnerType } from '@/types/service.type';
import { EUserType } from '@/types/user.type';
import {
  BrandAbout,
  BrandCard,
  BrandMissing,
  BrandQuickActions,
  BrandServicesList,
  BrandTeamList,
} from '@/views/brand-profile/components';
import {
  DangerZone,
  InviteTeamSheet,
  ProfilePhotosGrid,
  ProfileSkeleton,
  UploadBannerSheet,
  UploadPhotosSheet,
  UploadProfileImageSheet,
} from '@/views/profile/components';
import { useProfileGallery } from '@/views/profile/hooks/use-profile-gallery';
import { createImageUploadHandler } from '@/views/profile/utils/profile-media';
import { ScheduleDisplay } from '@/views/worker-profile/components';

import type { IWorker } from '@/types/worker.type';

type BrandProfileTab =
  | 'setup'
  | 'about'
  | 'services'
  | 'schedule'
  | 'team'
  | 'photos'
  | 'danger';

/**
 * @description Brand Profile Management Page - For creators to manage their brand
 * @author Salah
 * @date 2026-02-02
 */
const BrandProfileScreen: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { appType, setAppType } = useUserStore();

  // Check if user is creator
  const canEdit = appType === EUserType.CREATOR;

  // ───────────────── Queries ────────────────── //

  const { data: brand, refetch: refetchBrand, isLoading } = useGetBrand();
  const { data: photos, refetch: refetchPhotos } = useGetBrandPhotos(brand?.id);

  const { data: services, refetch: refetchServices } = useGetServices({
    ownerId: brand?.id,
    ownerType: brand?.id ? ServiceOwnerType.CREATOR : undefined,
  });

  const { data: team, refetch: refetchTeam } = useGetBrandTeam(brand?.id);

  const { data: schedule, refetch: refetchSchedule } = useGetSchedule(
    brand?.id,
  );

  // ───────────────── Mutations ────────────────── //
  const { mutateAsync: updateBrand } = useUpdateBrand();
  const { mutateAsync: uploadFile } = useUploadFile();
  const { mutateAsync: deleteFile } = useDeleteFile();
  const { mutateAsync: deleteBrand, isPending: isDeleting } = useDeleteBrand();

  // ───────────────── Local state ────────────────── //
  const [activeTab, setActiveTab] = useState<BrandProfileTab>('setup');
  const {
    selectedPhoto,
    setSelectedPhoto,
    mergedPhotos,
    handleUploadPhotos,
    handleDeletePhoto,
  } = useProfileGallery({
    ownerId: brand?.id,
    ownerType: 'BRAND',
    photos,
    uploadFile,
    deleteFile,
    defaultCategory: IMAGE_CATEGORIES.other,
    fileNamePrefix: 'brand-photo',
    onRefresh: refetchPhotos,
    onErrorMessage: t('common.errors.somethingWentWrong'),
  });

  const refetch = useCallback(() => {
    refetchBrand();
    refetchServices();
    refetchTeam();
    refetchPhotos();
    refetchSchedule();
  }, [
    refetchBrand,
    refetchServices,
    refetchTeam,
    refetchPhotos,
    refetchSchedule,
  ]);

  // ───────────────── Bottom sheet refs ────────────────── //
  const uploadBannerSheetRef = useRef<BottomSheetModal>(null);
  const uploadProfileImageSheetRef = useRef<BottomSheetModal>(null);
  const inviteTeamSheetRef = useRef<BottomSheetModal>(null);
  const uploadPhotosSheetRef = useRef<BottomSheetModal>(null);
  const deleteModalRef = useRef<DeleteModalRef>(null);

  // ───────────────── Handlers ────────────────── //
  const handleEditBrand = useCallback(() => {
    router.push(routes.brand.edit_profile);
  }, [router]);

  const handleEditBanner = useCallback(() => {
    uploadBannerSheetRef.current?.present();
  }, []);

  const handleUploadBanner = useMemo(
    () =>
      createImageUploadHandler({
        ownerId: brand?.id,
        ownerType: 'BRAND',
        category: IMAGE_CATEGORIES.brand_banner,
        uploadFile,
        onUpdate: async (url) => {
          if (!brand?.id) return;
          await updateBrand({ brandId: brand.id, bannerImage: url });
        },
        onErrorMessage: t('common.errors.somethingWentWrong'),
      }),
    [brand?.id, t, updateBrand, uploadFile],
  );
  const handleEditProfileImage = useCallback(() => {
    uploadProfileImageSheetRef.current?.present();
  }, []);

  const handleUploadProfileImage = useMemo(
    () =>
      createImageUploadHandler({
        ownerId: brand?.id,
        ownerType: 'BRAND',
        category: IMAGE_CATEGORIES.brand_avatar,
        uploadFile,
        onUpdate: async (url) => {
          if (!brand?.id) return;
          await updateBrand({ brandId: brand.id, profileImage: url });
        },
        onErrorMessage: t('common.errors.somethingWentWrong'),
      }),
    [brand?.id, t, updateBrand, uploadFile],
  );

  const handleAddWorker = useCallback(() => {
    inviteTeamSheetRef.current?.present();
  }, []);

  const handleDeleteBrand = useCallback(() => {
    if (!canEdit) return;
    deleteModalRef.current?.show();
  }, [canEdit]);

  const handleSetupWorkerProfile = useCallback(() => {
    setAppType(EUserType.WORKER);
    router.replace(routes.tabs.brand.worker_profile);
  }, [router, setAppType]);

  const handleWorkerPress = useCallback(
    (worker: IWorker) => {
      router.push(routes.worker.details(worker.id));
    },
    [router],
  );

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
      brand,
      workers: team || [],
      services,
      mergedPhotos,
      workingDays: schedule?.workingDays ?? [],
      handleAddPhoto,
      handleAddWorker,
      handleEditBrand,
      handleEditProfileImage,
      handleEditBanner,
    }),
    [
      canEdit,
      brand,
      team,
      services,
      mergedPhotos,
      schedule?.workingDays,
      handleAddPhoto,
      handleAddWorker,
      handleEditBrand,
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
        | 'team'
        | 'photos'
        | 'schedule'
      )[],
      variant: 'inline' | 'full' = 'inline',
    ) => (
      <BrandMissing
        {...missingProps}
        filterIds={filterIds as string[] | undefined}
        variant={variant}
      />
    ),
    [missingProps],
  );

  // Early returns for loading / missing / non-active statuses
  if (isLoading) return <ProfileSkeleton />;
  if (!brand) return <NotFoundScreen />;
  if (brand.status === BrandStatus.PENDING)
    return <PendingScreen onRefresh={refetchBrand} />;
  if (brand.status === BrandStatus.SUSPENDED) return <SuspendedScreen />;
  if (
    brand.status === BrandStatus.REJECTED ||
    brand.status === BrandStatus.WITHDRAWN
  )
    return <NotFoundScreen />;

  return (
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
          servicesCount={services?.length ?? 0}
          workersCount={team?.length ?? 0}
          photosCount={mergedPhotos.length}
          canEdit={canEdit}
          onEditAvatar={handleEditProfileImage}
          onEditBanner={handleEditBanner}
          onEdit={handleEditBrand}
        />

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as BrandProfileTab)}
          className="flex-1"
        >
          <TabsList className="bg-background/95 backdrop-blur-xl border-b border-border mt-4 mb-5">
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
              <TabsTrigger value="team">
                <Text>Team</Text>
              </TabsTrigger>
              <TabsTrigger value="photos">
                <Text>Photos</Text>
              </TabsTrigger>
              <TabsTrigger value="danger">
                <Text>Danger</Text>
              </TabsTrigger>
            </ScrollView>
          </TabsList>

          <TabsContent value="setup" className="flex-1">
            {renderMissing(undefined, 'full')}

            {/* Quick Actions */}
            {canEdit && (
              <BrandQuickActions
                onAddService={() =>
                  router.push(routes.screens.upsert_service())
                }
                onAddWorker={handleAddWorker}
                onManageHours={() =>
                  router.push(routes.screens.upsert_schedule(brand.id))
                }
                onSetupWorkerProfile={handleSetupWorkerProfile}
              />
            )}
          </TabsContent>

          {/* About Section */}
          <TabsContent value="about" className="flex-1 min-h-[50vh]">
            {renderMissing(['details', 'description', 'images'])}
            <BrandAbout
              brand={brand}
              canEdit={canEdit}
              onEdit={handleEditBrand}
            />
          </TabsContent>

          {/* Services Section */}
          <TabsContent value="services" className="flex-1 min-h-[50vh]">
            {renderMissing(['services'])}
            <BrandServicesList services={services} canEdit={canEdit} />
          </TabsContent>

          <TabsContent value="schedule" className="flex-1 min-h-[50vh]">
            {renderMissing(['schedule'])}
            <ScheduleDisplay
              workingDays={schedule?.workingDays ?? []}
              canEdit={canEdit}
              onEditSchedule={() =>
                router.push(routes.screens.upsert_schedule(brand.id))
              }
            />
          </TabsContent>

          {/* Team Section */}
          <TabsContent value="team" className="flex-1 min-h-[50vh]">
            {renderMissing(['team'])}
            <BrandTeamList
              workers={team ?? []}
              canEdit={canEdit}
              onAddWorker={handleAddWorker}
              onWorkerPress={handleWorkerPress}
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

          <TabsContent value="danger" className="flex-1 min-h-[50vh]">
            <DangerZone
              description="Deleting your brand is permanent. This removes your brand profile, team, services, schedule, and photos."
              actionTitle="Delete brand"
              actionDescription="You will lose access to all brand data and team members."
              actionLabel="Delete Brand"
              onPress={handleDeleteBrand}
              disabled={!canEdit || isDeleting}
            />
          </TabsContent>
        </Tabs>
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
        value={selectedPhoto}
        ref={uploadPhotosSheetRef}
        setValue={setSelectedPhoto}
        onUpload={handleUploadPhotos}
        onDelete={handleDeletePhoto}
      />

      <DeleteModal
        ref={deleteModalRef}
        onConfirm={async () => {
          await deleteBrand();
        }}
      />
    </SafeAreaView>
  );
};

export default BrandProfileScreen;
