import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { Loading, NotFoundScreen } from '@/components/status-screens';
import { useUploadFile } from '@/hooks/common';
import { useGetSchedule } from '@/hooks/schedule';
import {
  useCreateService,
  useDeleteService,
  useGetServices,
  useUpdateService,
  type ServiceFormData,
} from '@/hooks/service';
import {
  useGetWorkerProfile,
  useGetWorkerReviews,
  useUpdateWorkerProfile,
} from '@/hooks/worker';
import { useUserStore } from '@/stores';
import { ServiceOwnerType, type IService } from '@/types/service.type';
import {
  AboutSectionDisplay,
  EditProfileSheet,
  ProfileCard,
  QuickActionsSection,
  ReviewsList,
  ScheduleDisplay,
  ServicesList,
  UpsertServiceSheet,
} from '@/views/worker-profile/components';
import { type WorkerProfileFormData } from '@/views/worker-profile/utils/helpers';

import type { UploadedFile } from '@/utils/file-upload';

/**
 * Worker Profile View Screen
 * Main view for worker profile management
 */
const WorkerProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useUserStore();

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
  const {
    data: schedule,
    refetch: refetchSchedule,
    isLoading: isScheduleLoading,
  } = useGetSchedule({
    brandId: worker?.brandId,
  });
  const {
    data: reviews,
    refetch: refetchReviews,
    isLoading: isReviewsLoading,
  } = useGetWorkerReviews({
    workerId: worker?.id,
  });

  const updateWorkerMutation = useUpdateWorkerProfile(worker?.id || '');
  const uploadFileMutation = useUploadFile();
  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();

  const [selectedService, setSelectedService] = useState<IService | null>(null);

  const workingDays = useMemo(
    () => schedule?.workingDays ?? [],
    [schedule?.workingDays],
  );
  const serviceList = services ?? [];
  const reviewList = reviews ?? [];

  // Bottom sheet refs
  const editProfileSheetRef = useRef<BottomSheetModal>(null);
  const upsertServiceSheetRef = useRef<BottomSheetModal>(null);

  // Handlers
  const handleEditProfile = () => {
    editProfileSheetRef.current?.present();
  };

  const handleSaveProfile = (data: WorkerProfileFormData) => {
    if (!worker?.id) return;
    updateWorkerMutation.mutate({
      name: data.name,
      role: data.role,
      bio: data.bio,
      specialties: data.specialties,
      email: data.email,
      phone: data.phone,
    });
  };

  const handleAddService = () => {
    setSelectedService(null);
    upsertServiceSheetRef.current?.present();
  };

  const handleServicePress = (service: IService) => {
    setSelectedService(service);
    upsertServiceSheetRef.current?.present();
  };

  const handleSaveService = async (
    serviceId: string | null,
    data: ServiceFormData,
  ) => {
    if (!worker?.brandId || !user?.id) return;

    if (serviceId) {
      await updateServiceMutation.mutateAsync({
        serviceId,
        payload: {
          name: data.name,
          description: data.description,
          durationMins: parseInt(data.durationMins, 10),
          price: parseFloat(data.price),
        },
      });
    } else {
      await createServiceMutation.mutateAsync({
        brandId: worker.brandId,
        name: data.name,
        description: data.description,
        durationMins: parseInt(data.durationMins, 10),
        price: parseFloat(data.price),
        ownerId: user.id,
        ownerType: ServiceOwnerType.WORKER,
      });
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    await deleteServiceMutation.mutateAsync(serviceId);
  };

  const handleEditSchedule = () => {
    if (worker?.brandId) {
      router.push(`/(slide-screens)/upsert-schedule?brandId=${worker.brandId}`);
    }
  };

  const buildUploadedFile = (uri: string, label: string): UploadedFile => {
    const name = uri.split('/').pop() || `${label}-${Date.now()}.jpg`;
    return {
      uri,
      name,
      type: 'image/jpeg',
    };
  };

  const handleAvatarChange = async (uri: string) => {
    if (!worker?.id) return;
    const file = buildUploadedFile(uri, 'worker-avatar');
    const { url } = await uploadFileMutation.mutateAsync({ file });
    updateWorkerMutation.mutate({ avatar: url });
  };

  const handleBannerChange = async (uri: string) => {
    if (!worker?.id) return;
    const file = buildUploadedFile(uri, 'worker-banner');
    const { url } = await uploadFileMutation.mutateAsync({ file });
    updateWorkerMutation.mutate({ coverImage: url });
  };

  const handleRefresh = () => {
    refetchWorker();
    refetchServices();
    refetchSchedule();
    refetchReviews();
  };

  const isRefreshing =
    isWorkerLoading ||
    isServicesLoading ||
    isScheduleLoading ||
    isReviewsLoading;

  if (isWorkerLoading) {
    return <Loading />;
  }

  if (!worker) {
    return <NotFoundScreen />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Profile Card */}
        <ProfileCard
          worker={worker}
          servicesCount={serviceList.length}
          workDaysCount={workingDays.length}
          reviewsCount={reviewList.length}
          onEdit={handleEditProfile}
          onAvatarChange={handleAvatarChange}
          onBannerChange={handleBannerChange}
        />

        {/* Quick Actions */}
        <QuickActionsSection
          onAddService={handleAddService}
          onEditSchedule={handleEditSchedule}
        />

        {/* About Section */}
        <AboutSectionDisplay worker={worker} onEdit={handleEditProfile} />

        {/* Services Section */}
        <ServicesList
          services={serviceList}
          onAddService={handleAddService}
          onServicePress={handleServicePress}
        />

        {/* Schedule Overview */}
        <ScheduleDisplay
          workingDays={workingDays}
          onEditSchedule={handleEditSchedule}
        />

        {/* Reviews Section */}
        <ReviewsList reviews={reviewList} maxDisplay={2} />
      </ScrollView>

      {/* Bottom Sheets */}
      <EditProfileSheet
        ref={editProfileSheetRef}
        worker={worker}
        onSave={handleSaveProfile}
      />

      <UpsertServiceSheet
        ref={upsertServiceSheetRef}
        service={selectedService}
        onSave={handleSaveService}
        onDelete={handleDeleteService}
      />
    </SafeAreaView>
  );
};

export default WorkerProfileScreen;
