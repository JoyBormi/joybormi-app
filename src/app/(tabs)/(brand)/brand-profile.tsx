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
  InviteTeamSheet,
  UploadBannerSheet,
  UploadPhotosSheet,
  UploadProfileImageSheet,
} from '@/components/brand-worker';
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
  useGetBrand,
  useGetBrandPhotos,
  useGetBrandTeam,
  useUpdateBrand,
} from '@/hooks/brand';
import { normalizeFileUrl, useDeleteFile, useUploadFile } from '@/hooks/files';
import { useGetSchedule } from '@/hooks/schedule';
import { useGetServices } from '@/hooks/service';
import { buildUploadedFile } from '@/lib/utils';
import { toast } from '@/providers/toaster';
import { useUserStore } from '@/stores';
import { BrandStatus } from '@/types/brand.type';
import { IFile } from '@/types/file.type';
import { EUserType } from '@/types/user.type';
import {
  BrandAbout,
  BrandCard,
  BrandMissing,
  BrandQuickActions,
  BrandServicesList,
  BrandTeamList,
} from '@/views/brand-profile/components';
import { ProfilePhotosGrid, ProfileSkeleton } from '@/views/profile/components';
import { ScheduleDisplay } from '@/views/worker-profile/components';

import type { IWorker } from '@/types/worker.type';

type BrandProfileTab =
  | 'setup'
  | 'about'
  | 'services'
  | 'schedule'
  | 'team'
  | 'photos';

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
    brandId: brand?.id,
  });

  const { data: team, refetch: refetchTeam } = useGetBrandTeam(brand?.id);

  const { data: schedule, refetch: refetchSchedule } = useGetSchedule(
    brand?.id,
  );

  // ───────────────── Mutations ────────────────── //
  const { mutateAsync: updateBrand } = useUpdateBrand();
  const { mutateAsync: uploadFile } = useUploadFile();
  const { mutateAsync: deleteFile } = useDeleteFile();

  // ───────────────── Local state ────────────────── //
  const [activeTab, setActiveTab] = useState<BrandProfileTab>('setup');
  const [selectedPhoto, setSelectedPhoto] = useState<IFile | null>(null);
  const [localPhotos, setLocalPhotos] = useState<IFile[]>([]);
  const mergedPhotos = useMemo(
    () => [...localPhotos, ...(photos ?? [])],
    [localPhotos, photos],
  );

  const refetch = () => {
    refetchBrand();
    refetchServices();
    refetchTeam();
    refetchPhotos();
    refetchSchedule();
  };

  // ───────────────── Bottom sheet refs ────────────────── //
  const uploadBannerSheetRef = useRef<BottomSheetModal>(null);
  const uploadProfileImageSheetRef = useRef<BottomSheetModal>(null);
  const inviteTeamSheetRef = useRef<BottomSheetModal>(null);
  const uploadPhotosSheetRef = useRef<BottomSheetModal>(null);

  // ───────────────── Handlers ────────────────── //
  const handleEditBrand = useCallback(() => {
    router.push(routes.brand.edit_profile);
  }, [router]);

  const handleEditBanner = useCallback(() => {
    uploadBannerSheetRef.current?.present();
  }, [uploadBannerSheetRef]);

  const handleUploadBanner = async (uri: string) => {
    if (!brand?.id) return;

    try {
      const file = buildUploadedFile(uri, IMAGE_CATEGORIES.brand_banner);
      const uploadedFile = await uploadFile({
        file,
        ownerId: brand.id,
        ownerType: 'BRAND',
        category: IMAGE_CATEGORIES.brand_banner,
      });

      if (!uploadedFile.url) {
        throw new Error(t('common.errors.somethingWentWrong'));
      }

      const bannerUrl = normalizeFileUrl(uploadedFile.url);

      if (!bannerUrl) {
        throw new Error(t('common.errors.somethingWentWrong'));
      }

      await updateBrand({ brandId: brand.id, bannerImage: bannerUrl });
    } catch {
      toast.error({ title: t('common.errors.somethingWentWrong') });
    }
  };
  const handleEditProfileImage = useCallback(() => {
    uploadProfileImageSheetRef.current?.present();
  }, [uploadProfileImageSheetRef]);

  const handleUploadProfileImage = async (uri: string) => {
    if (!brand?.id) return;

    try {
      const file = buildUploadedFile(uri, IMAGE_CATEGORIES.brand_avatar);
      const uploadedFile = await uploadFile({
        file,
        ownerId: brand.id,
        ownerType: 'BRAND',
        category: IMAGE_CATEGORIES.brand_avatar,
      });

      if (!uploadedFile.url) {
        throw new Error(t('common.errors.somethingWentWrong'));
      }

      const profileUrl = normalizeFileUrl(uploadedFile.url);

      if (!profileUrl) {
        throw new Error(t('common.errors.somethingWentWrong'));
      }

      await updateBrand({ brandId: brand.id, profileImage: profileUrl });
    } catch {
      toast.error({ title: t('common.errors.somethingWentWrong') });
    }
  };

  const handleAddWorker = useCallback(() => {
    inviteTeamSheetRef.current?.present();
  }, [inviteTeamSheetRef]);

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
  }, [uploadPhotosSheetRef]);

  const handlePhotoPress = (photo: IFile) => {
    setSelectedPhoto(photo);
    uploadPhotosSheetRef.current?.present();
  };

  /**
   * @description Uploads new photos to the brand
   * @param newPhotos The new photos to upload
   */
  const handleUploadPhotos = async (
    newPhotos: { uri: string; category: string }[],
  ) => {
    if (!brand?.id || newPhotos.length === 0) return;

    try {
      const uploadResults = await Promise.all(
        newPhotos.map((photo, index) =>
          uploadFile({
            ownerId: brand.id,
            ownerType: 'BRAND',
            file: buildUploadedFile(photo.uri, `brand-photo-${index}`),
            category: photo.category ?? IMAGE_CATEGORIES.other,
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
              'other') as IFile['category'],
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

  /**
   * @description Deletes a photo
   * @param fileId The ID of the photo to delete
   */
  const handleDeletePhoto = async (fileId: string) => {
    if (!brand?.id || !fileId) return;
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

  // Early return if no brand data
  if (isLoading) return <ProfileSkeleton />;
  if (!brand) return <NotFoundScreen />;

  return (
    <Fragment>
      {brand?.status === BrandStatus.PENDING ? (
        <PendingScreen onRefresh={refetchBrand} />
      ) : brand?.status === BrandStatus.SUSPENDED ? (
        <SuspendedScreen />
      ) : brand?.status === BrandStatus.REJECTED ||
        brand?.status === BrandStatus.WITHDRAWN ? (
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
              workersCount={team?.length || 0}
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
                </ScrollView>
              </TabsList>

              <TabsContent value="setup" className="flex-1">
                {renderMissing(undefined, 'full')}

                {/* Quick Actions */}
                {canEdit && (
                  <BrandQuickActions
                    onAddService={() =>
                      router.push(
                        routes.screens.upsert_service({
                          ownerId: brand.id,
                          ownerType: 'brand',
                        }),
                      )
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
              <TabsContent value="about" className="flex-1">
                {renderMissing(['details', 'description', 'images'])}
                <BrandAbout
                  brand={brand}
                  canEdit={canEdit}
                  onEdit={handleEditBrand}
                />
              </TabsContent>

              {/* Services Section */}
              <TabsContent value="services" className="flex-1">
                {renderMissing(['services'])}
                <BrandServicesList
                  ownerId={brand.id}
                  services={services}
                  canEdit={canEdit}
                />
              </TabsContent>

              <TabsContent value="schedule" className="flex-1">
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
              <TabsContent value="team" className="flex-1">
                {renderMissing(['team'])}
                <BrandTeamList
                  workers={team || []}
                  canEdit={canEdit}
                  onAddWorker={handleAddWorker}
                  onWorkerPress={handleWorkerPress}
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
            value={selectedPhoto}
            ref={uploadPhotosSheetRef}
            setValue={setSelectedPhoto}
            onUpload={handleUploadPhotos}
            onDelete={handleDeletePhoto}
          />
        </SafeAreaView>
      )}
    </Fragment>
  );
};

export default BrandProfileScreen;
