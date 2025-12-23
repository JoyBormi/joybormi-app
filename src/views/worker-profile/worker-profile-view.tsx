import { Text } from '@/components/ui';
import { useUserStore } from '@/stores';
import type { IService } from '@/types/worker.type';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  AboutSectionDisplay,
  AddServiceSheet,
  EditProfileSheet,
  EditServiceSheet,
  ProfileCard,
  QuickActionsSection,
  ReviewsList,
  ScheduleDisplay,
  ServicesList,
} from './components';
import {
  getMockReviews,
  getMockServices,
  getMockWorker,
  getMockWorkingDays,
  type ServiceFormData,
  type WorkerProfileFormData,
} from './utils/helpers';

/**
 * Worker Profile View Component
 * Main view for worker profile management
 */
const WorkerProfileView: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { user } = useUserStore();

  // State
  const [worker, setWorker] = useState(() =>
    getMockWorker(user?.id, user?.first_name, user?.last_name),
  );
  const [services, setServices] = useState(getMockServices());
  const [workingDays] = useState(getMockWorkingDays());
  const [reviews] = useState(getMockReviews());
  const [selectedService, setSelectedService] = useState<IService | null>(null);

  // Bottom sheet refs
  const editProfileSheetRef = useRef<BottomSheetModal>(null);
  const addServiceSheetRef = useRef<BottomSheetModal>(null);
  const editServiceSheetRef = useRef<BottomSheetModal>(null);

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
    addServiceSheetRef.current?.present();
  };

  const handleSaveNewService = (data: ServiceFormData) => {
    const newService: IService = {
      id: `service-${Date.now()}`,
      creatorId: worker.userId,
      brandId: worker.brandId,
      createdAt: new Date().toISOString(),
      ...data,
    };
    setServices((prev) => [...prev, newService]);
    console.warn('Service added:', newService);
  };

  const handleServicePress = (service: IService) => {
    setSelectedService(service);
    editServiceSheetRef.current?.present();
  };

  const handleSaveService = (serviceId: string, data: ServiceFormData) => {
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
  };

  const handleDeleteService = (serviceId: string) => {
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
    console.warn('Service deleted:', serviceId);
  };

  const handleEditSchedule = () => {
    console.warn('Edit schedule - to be implemented');
    // Navigate to schedule editor or open modal
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Header */}
        <View
          className="flex-row items-center justify-between px-6 mb-6"
          style={{ paddingTop: insets.top + 16 }}
        >
          <Text className="font-heading text-xl text-foreground">
            My Profile
          </Text>
        </View>

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

      <AddServiceSheet ref={addServiceSheetRef} onSave={handleSaveNewService} />

      <EditServiceSheet
        ref={editServiceSheetRef}
        service={selectedService}
        onSave={handleSaveService}
        onDelete={handleDeleteService}
      />
    </SafeAreaView>
  );
};

export default WorkerProfileView;
