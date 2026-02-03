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
  BlockedScreen,
  NotFoundScreen,
  PendingScreen,
  SuspendedScreen,
} from '@/components/status-screens';
import { IMAGE_CATEGORIES } from '@/constants/global.constants';
import {
  useGetBrand,
  useGetBrandPhotos,
  useGetBrandTeam,
  useUpdateBrand,
} from '@/hooks/brand';
import {
  normalizeFileUrl,
  useDeleteFile,
  useUpdateFileMetadata,
  useUploadFile,
} from '@/hooks/files';
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

/**
 * @description Brand Profile Management Page - For creators to manage their brand
 * @author Salah
 * @date 2026-02-02
 */
const BrandProfileScreen: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { appType, setAppType, user } = useUserStore();

  // Check if user is creator
  const canEdit = appType === EUserType.CREATOR;

  // ───────────────── Queries ────────────────── //

  const { data: brand, refetch: refetchBrand, isLoading } = useGetBrand();
  const { data: photos, refetch: refetchPhotos } = useGetBrandPhotos(user?.id);

  const { data: services, refetch: refetchServices } = useGetServices({
    brandId: brand?.id,
  });

  const { data: team, refetch: refetchTeam } = useGetBrandTeam({
    brandId: brand?.id,
  });

  const { data: schedule, refetch: refetchSchedule } = useGetSchedule({
    brandId: brand?.id,
  });

  // ───────────────── Mutations ────────────────── //
  const { mutateAsync: updateBrand } = useUpdateBrand();
  const { mutateAsync: uploadFile } = useUploadFile();
  const { mutateAsync: deleteFile } = useDeleteFile();
  const { mutateAsync: updateFileMetadata } = useUpdateFileMetadata();

  // ───────────────── Local state ────────────────── //
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
    router.push('/(screens)/edit-brand-profile');
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
        userId: user?.id,
        category: IMAGE_CATEGORIES.brand_banner,
        description: 'Brand banner image',
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
        userId: user?.id,
        category: IMAGE_CATEGORIES.brand_avatar,
        description: 'Brand profile image',
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
    router.replace('/(tabs)/(brand)/worker-profile');
  }, [router, setAppType]);

  const handleWorkerPress = useCallback(
    (worker: IWorker) => {
      router.push(`/(dynamic-brand)/team/worker/${worker.id}`);
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
    if (!brand?.id || newPhotos.length === 0 || !user) return;

    try {
      const uploadResults = await Promise.all(
        newPhotos.map((photo, index) =>
          uploadFile({
            userId: user.id,
            file: buildUploadedFile(photo.uri, `brand-photo-${index}`),
            category: photo.category ?? IMAGE_CATEGORIES.other,
            description: 'Brand gallery photo',
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

  /**
   * @description Replaces a photo with a new one
   * @param fileId The ID of the photo to replace
   */
  const handleReplacePhoto = async (fileId: string) => {
    if (!brand?.id || !fileId || !user) return;
    try {
      await updateFileMetadata({
        id: fileId,
        payload: {
          category: IMAGE_CATEGORIES.other,
          description: 'Brand gallery photo',
          userId: user.id,
        },
      });
      refetchPhotos();
    } catch {
      toast.error({ title: t('common.errors.somethingWentWrong') });
    }
  };

  // Early return if no brand data
  if (isLoading) return <ProfileSkeleton />;
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
              workersCount={team?.length || 0}
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
                    `/(slide-screens)/upsert-service?ownerId=${brand.id}&ownerType=brand`,
                  )
                }
                onAddWorker={handleAddWorker}
                onManageHours={() =>
                  router.push(`/(screens)/upsert-schedule?brandId=${brand.id}`)
                }
                onSetupWorkerProfile={handleSetupWorkerProfile}
              />
            )}

            <BrandMissing
              canEdit={canEdit}
              brand={brand}
              workers={team || []}
              services={services}
              mergedPhotos={mergedPhotos}
              workingDays={schedule?.workingDays ?? []}
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
              workingDays={schedule?.workingDays ?? []}
              canEdit={canEdit}
              onEditSchedule={() =>
                router.push(`/(screens)/upsert-schedule?brandId=${brand.id}`)
              }
            />

            {/* Team Section */}
            <BrandTeamList
              workers={team || []}
              canEdit={canEdit}
              onAddWorker={handleAddWorker}
              onWorkerPress={handleWorkerPress}
            />

            {/* Photos Section */}
            <ProfilePhotosGrid
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
            value={selectedPhoto}
            ref={uploadPhotosSheetRef}
            setValue={setSelectedPhoto}
            onUpload={handleUploadPhotos}
            onDelete={handleDeletePhoto}
            onReplace={handleReplacePhoto}
          />
        </SafeAreaView>
      )}
    </Fragment>
  );
};

export default BrandProfileScreen;
