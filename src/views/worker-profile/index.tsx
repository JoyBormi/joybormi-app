import { Button, Text } from '@/components/ui';
import Icons from '@/lib/icons';
import { useUserStore } from '@/stores';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  AboutSection,
  AddServiceModal,
  EditProfileModal,
  EditServiceModal,
  ProfileHeader,
  QuickActions,
  QuickStats,
  ReviewsSection,
  ScheduleOverview,
  ServicesSection,
} from './components';
import {
  getMockReviews,
  getMockServices,
  getMockWorker,
  getMockWorkingDays,
  type ServiceFormData,
  type WorkerProfileFormData,
} from './utils';
import type { Service } from './worker-profile.d';

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

  // Modal states
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [addServiceVisible, setAddServiceVisible] = useState(false);
  const [editServiceVisible, setEditServiceVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Handlers
  const handleEditProfile = () => {
    setEditProfileVisible(true);
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
    setAddServiceVisible(true);
  };

  const handleSaveNewService = (data: ServiceFormData) => {
    const newService: Service = {
      id: `service-${Date.now()}`,
      ...data,
    };
    setServices((prev) => [...prev, newService]);
    console.warn('Service added:', newService);
  };

  const handleServicePress = (service: Service) => {
    setSelectedService(service);
    setEditServiceVisible(true);
  };

  const handleSaveService = (serviceId: string, data: ServiceFormData) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === serviceId
          ? {
              ...s,
              name: data.name,
              description: data.description,
              duration_mins: data.duration_mins,
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
    console.warn('Edit schedule');
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
        <View className="px-6 mb-8">
          <View className="bg-card/50 backdrop-blur-xl rounded-3xl p-6 border border-border/50">
            <ProfileHeader worker={worker} onEdit={handleEditProfile} />
            <QuickStats
              servicesCount={services.length}
              workDaysCount={workingDays.length}
              reviewsCount={reviews.length}
            />
            <Button onPress={handleEditProfile} className="bg-primary">
              <View className="flex-row items-center gap-2">
                <Icons.Pencil size={18} className="text-primary-foreground" />
                <Text className="font-subtitle text-primary-foreground">
                  Edit Profile
                </Text>
              </View>
            </Button>
          </View>
        </View>

        {/* Quick Actions */}
        <QuickActions
          onAddService={handleAddService}
          onEditSchedule={handleEditSchedule}
        />

        {/* About Section */}
        <AboutSection worker={worker} onEdit={handleEditProfile} />

        {/* Services Section */}
        <ServicesSection
          services={services}
          onAddService={handleAddService}
          onServicePress={handleServicePress}
        />

        {/* Schedule Overview */}
        <ScheduleOverview
          workingDays={workingDays}
          onEditSchedule={handleEditSchedule}
        />

        {/* Reviews Section */}
        <ReviewsSection reviews={reviews} maxDisplay={2} />
      </ScrollView>

      {/* Modals */}
      <EditProfileModal
        visible={editProfileVisible}
        worker={worker}
        onClose={() => setEditProfileVisible(false)}
        onSave={handleSaveProfile}
      />

      <AddServiceModal
        visible={addServiceVisible}
        onClose={() => setAddServiceVisible(false)}
        onSave={handleSaveNewService}
      />

      <EditServiceModal
        visible={editServiceVisible}
        service={selectedService}
        onClose={() => {
          setEditServiceVisible(false);
          setSelectedService(null);
        }}
        onSave={handleSaveService}
        onDelete={handleDeleteService}
      />
    </SafeAreaView>
  );
};

export default WorkerProfileView;
