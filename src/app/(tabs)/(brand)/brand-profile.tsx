import { ManageScheduleSheet } from '@/components/shared/manage-schedule.sheet';
import { UpsertServiceSheet } from '@/components/shared/upsert-service.sheet';
import { useUserStore } from '@/stores';
import type { IBrandService } from '@/types/brand.type';
import { EUserType } from '@/types/user.type';
import type { IWorkingDay } from '@/types/worker.type';
import {
  mockBrand,
  mockPhotos,
  mockReviews,
  mockServices,
  mockWorkers,
} from '@/views/brand';
import {
  BrandAbout,
  BrandCard,
  BrandPhotosGrid,
  BrandQuickActions,
  BrandReviewsList,
  BrandServicesList,
  BrandTeamList,
  EditBrandSheet,
  InviteWorkerSheet,
  ManagePhotosSheet,
  type BrandFormData,
  type InviteWorkerFormData,
} from '@/views/brand-profile/components';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

/**
 * Brand Profile Management Page - For creators/workers to manage their brand
 * Route: /(tabs)/(brand)/brand-profile
 * This page allows editing and managing brand information
 */
const BrandProfileScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { appType } = useUserStore();

  // Check if user is creator or worker
  const isCreator = appType === EUserType.CREATOR;
  const canEdit = isCreator;

  // State - In production, fetch from API based on user's brand
  const [brand] = useState(mockBrand);
  const [services, setServices] = useState(mockServices);
  const [workers] = useState(mockWorkers);
  const [photos, setPhotos] = useState(mockPhotos);
  const [reviews] = useState(mockReviews);
  const [workingDays, setWorkingDays] = useState<IWorkingDay[]>([]);
  const [selectedService, setSelectedService] = useState<IBrandService | null>(
    null,
  );

  // Bottom sheet refs
  const editBrandSheetRef = useRef<BottomSheetModal>(null);
  const upsertServiceSheetRef = useRef<BottomSheetModal>(null);
  const inviteWorkerSheetRef = useRef<BottomSheetModal>(null);
  const managePhotosSheetRef = useRef<BottomSheetModal>(null);
  const manageScheduleSheetRef = useRef<BottomSheetModal>(null);

  // Handlers
  const handleEditBrand = () => {
    editBrandSheetRef.current?.present();
  };

  const handleSaveBrand = (data: BrandFormData) => {
    console.warn('Save brand:', data);
    // TODO: API call to update brand
  };

  const handleAddService = () => {
    setSelectedService(null);
    upsertServiceSheetRef.current?.present();
  };

  const handleServicePress = (service: IBrandService) => {
    setSelectedService(service);
    upsertServiceSheetRef.current?.present();
  };

  const handleSaveService = (
    serviceId: string | null,
    data: {
      name: string;
      description: string;
      durationMins: number;
      price: string;
    },
  ) => {
    if (serviceId) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === serviceId
            ? {
                ...s,
                name: data.name,
                description: data.description,
                duration: data.durationMins,
                price: parseFloat(data.price),
              }
            : s,
        ),
      );
      console.warn('Service updated:', serviceId, data);
    } else {
      const newService: IBrandService = {
        id: `service-${Date.now()}`,
        name: data.name,
        description: data.description,
        duration: data.durationMins,
        price: parseFloat(data.price),
        currency: 'USD',
        category: 'General',
        popular: false,
      };
      setServices((prev) => [...prev, newService]);
      console.warn('Service added:', newService);
    }
  };

  const handleDeleteService = (serviceId: string) => {
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
    console.warn('Service deleted:', serviceId);
  };

  const handleAddWorker = () => {
    inviteWorkerSheetRef.current?.present();
  };

  const handleInviteWorker = (data: InviteWorkerFormData) => {
    console.warn('Invite worker:', data);
    // TODO: API call to send invitation
  };

  const handleWorkerPress = (worker: (typeof workers)[0]) => {
    router.push(`/(dynamic-brand)/team/worker/${worker.id}`);
  };

  const handleManageHours = () => {
    manageScheduleSheetRef.current?.present();
  };

  const handleSaveSchedule = (newWorkingDays: IWorkingDay[]) => {
    setWorkingDays(newWorkingDays);
    console.warn('Schedule updated:', newWorkingDays);
    // TODO: API call to update schedule
  };

  const handleAddPhoto = () => {
    managePhotosSheetRef.current?.present();
  };

  const handlePhotoPress = () => {
    managePhotosSheetRef.current?.present();
  };

  const handleAddPhotos = (newPhotos: string[]) => {
    const photosToAdd = newPhotos.map((url, index) => ({
      id: `photo-${Date.now()}-${index}`,
      url,
      caption: '',
      category: 'other' as const,
      uploadedAt: new Date().toISOString(),
    }));
    setPhotos((prev) => [...prev, ...photosToAdd]);
    console.warn('Photos added:', photosToAdd);
    // TODO: API call to upload photos
  };

  const handleDeletePhoto = (photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    console.warn('Photo deleted:', photoId);
    // TODO: API call to delete photo
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Brand Profile Card */}
        <BrandCard
          brand={brand}
          servicesCount={services.length}
          workersCount={workers.length}
          photosCount={photos.length}
          canEdit={canEdit}
          onEdit={handleEditBrand}
        />

        {/* Quick Actions */}
        {canEdit && (
          <BrandQuickActions
            onAddService={handleAddService}
            onAddWorker={handleAddWorker}
            onManageHours={handleManageHours}
          />
        )}

        {/* About Section */}
        <BrandAbout brand={brand} canEdit={canEdit} onEdit={handleEditBrand} />

        {/* Services Section */}
        <BrandServicesList
          services={services}
          canEdit={canEdit}
          onAddService={handleAddService}
          onServicePress={handleServicePress}
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
          photos={photos}
          canEdit={canEdit}
          onAddPhoto={handleAddPhoto}
          onPhotoPress={handlePhotoPress}
        />

        {/* Reviews Section */}
        <BrandReviewsList reviews={reviews} maxDisplay={2} />
      </ScrollView>

      {/* Bottom Sheets */}
      <EditBrandSheet
        ref={editBrandSheetRef}
        brand={brand}
        onSave={handleSaveBrand}
      />

      <UpsertServiceSheet
        ref={upsertServiceSheetRef}
        service={
          selectedService
            ? {
                id: selectedService.id,
                name: selectedService.name,
                description: selectedService.description,
                durationMins: selectedService.duration,
                price: selectedService.price.toString(),
                creatorId: '',
                brandId: brand.id,
                createdAt: new Date().toISOString(),
              }
            : null
        }
        onSave={handleSaveService}
        onDelete={handleDeleteService}
      />

      <InviteWorkerSheet
        ref={inviteWorkerSheetRef}
        onInvite={handleInviteWorker}
      />

      <ManagePhotosSheet
        ref={managePhotosSheetRef}
        photos={photos}
        onAddPhotos={handleAddPhotos}
        onDeletePhoto={handleDeletePhoto}
      />

      <ManageScheduleSheet
        ref={manageScheduleSheetRef}
        workingDays={workingDays}
        onSave={handleSaveSchedule}
      />
    </SafeAreaView>
  );
};

export default BrandProfileScreen;
