import {
  ManageScheduleSheet,
  UpsertServiceSheet,
} from '@/components/shared/brand-worker';
import { useUserStore } from '@/stores';
import type { IService } from '@/types/worker.type';
import {
  AboutSectionDisplay,
  EditProfileSheet,
  ProfileCard,
  QuickActionsSection,
  ReviewsList,
  ScheduleDisplay,
  ServicesList,
} from '@/views/worker-profile/components';
import {
  getMockReviews,
  getMockServices,
  getMockWorker,
  getMockWorkingDays,
  type ServiceFormData,
  type WorkerProfileFormData,
} from '@/views/worker-profile/utils/helpers';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

/**
 * Worker Profile View Screen
 * Main view for worker profile management
 */
const WorkerProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { user } = useUserStore();

  // State
  const [worker, setWorker] = useState(() =>
    getMockWorker(user?.id, user?.first_name, user?.last_name),
  );
  const [services, setServices] = useState(getMockServices());
  const [workingDays, setWorkingDays] = useState(getMockWorkingDays());
  const [reviews] = useState(getMockReviews());
  const [selectedService, setSelectedService] = useState<IService | null>(null);

  // Bottom sheet refs
  const editProfileSheetRef = useRef<BottomSheetModal>(null);
  const upsertServiceSheetRef = useRef<BottomSheetModal>(null);
  const manageScheduleSheetRef = useRef<BottomSheetModal>(null);

  // Handlers
  const handleEditProfile = () => {
    editProfileSheetRef.current?.present();
  };

  const handleSaveProfile = (data: WorkerProfileFormData) => {
    setWorker((prev) => ({
      ...prev,
      name: data.name,
      role: data.role,
      bio: data.bio,
      specialties: data.specialties,
      email: data.email,
      phone: data.phone,
      avatar: data.avatar || prev.avatar,
      coverImage: data.coverImage || prev.coverImage,
    }));
    console.warn('Profile updated:', data);
  };

  const handleAddService = () => {
    setSelectedService(null);
    upsertServiceSheetRef.current?.present();
  };

  const handleServicePress = (service: IService) => {
    setSelectedService(service);
    upsertServiceSheetRef.current?.present();
  };

  const handleSaveService = (
    serviceId: string | null,
    data: ServiceFormData,
  ) => {
    if (serviceId) {
      // Update existing service
      setServices((prev) =>
        prev.map((s) =>
          s.id === serviceId
            ? {
                ...s,
                name: data.name,
                description: data.description,
                durationMins: data.durationMins,
                price: data.price,
              }
            : s,
        ),
      );
      console.warn('Service updated:', serviceId, data);
    } else {
      // Create new service
      const newService: IService = {
        id: `service-${Date.now()}`,
        creatorId: worker.userId,
        brandId: worker.brandId,
        createdAt: new Date().toISOString(),
        ...data,
      };
      setServices((prev) => [...prev, newService]);
      console.warn('Service added:', newService);
    }
  };

  const handleDeleteService = (serviceId: string) => {
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
    console.warn('Service deleted:', serviceId);
  };

  const handleEditSchedule = () => {
    manageScheduleSheetRef.current?.present();
  };

  const handleSaveSchedule = (newWorkingDays: typeof workingDays) => {
    setWorkingDays(newWorkingDays);
    console.warn('Schedule updated:', newWorkingDays);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Profile Card */}
        <ProfileCard
          worker={worker}
          servicesCount={services.length}
          workDaysCount={workingDays.length}
          reviewsCount={reviews.length}
          onEdit={handleEditProfile}
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
          services={services}
          onAddService={handleAddService}
          onServicePress={handleServicePress}
        />

        {/* Schedule Overview */}
        <ScheduleDisplay
          workingDays={workingDays}
          onEditSchedule={handleEditSchedule}
        />

        {/* Reviews Section */}
        <ReviewsList reviews={reviews} maxDisplay={2} />
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

      <ManageScheduleSheet
        ref={manageScheduleSheetRef}
        workingDays={workingDays}
        onSave={handleSaveSchedule}
      />
    </SafeAreaView>
  );
};

export default WorkerProfileScreen;
