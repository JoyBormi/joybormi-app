import { Button, Text } from '@/components/ui';
import { Feedback } from '@/lib/haptics';
import {
  BasicInfo,
  ContactInfo,
  LocationDetails,
  Review,
  StepIndicator,
  WorkingHours,
} from '@/views/store/set-up';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Platform, ScrollView, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

type SetupStep = 0 | 1 | 2 | 3 | 4;

interface DaySchedule {
  day: string;
  isOpen: boolean;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  breakStart?: string;
  breakEnd?: string;
}

interface BrandFormData {
  // Basic Info
  brandName: string;
  description: string;
  workingFields: string; // comma-separated, will be split into array

  // Location
  country: string;
  state?: string;
  city?: string;
  street: string;
  detailedAddress?: string;
  postalCode?: string;

  // Contact
  email: string;
  phone?: string;

  // Working Hours
  workingDays: DaySchedule[];
}

const STEPS = [
  { label: 'Basic', icon: '📝' },
  { label: 'Location', icon: '📍' },
  { label: 'Contact', icon: '📞' },
  { label: 'Schedule', icon: '📅' },
  { label: 'Review', icon: '✓' },
];

const SetUpStore: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState<SetupStep>(0);

  const { control, handleSubmit, setValue } = useForm<BrandFormData>({
    defaultValues: {
      brandName: '',
      description: '',
      workingFields: '',
      country: '',
      state: '',
      city: '',
      street: '',
      detailedAddress: '',
      postalCode: '',
      email: '',
      phone: '',
      workingDays: [],
    },
  });

  const handleNext = () => {
    Feedback.light();
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((currentStep + 1) as SetupStep);
    }
  };

  const handleBack = () => {
    Feedback.light();
    if (currentStep > 0) {
      setCurrentStep((currentStep - 1) as SetupStep);
    }
  };

  const onSubmit = (data: BrandFormData) => {
    Feedback.success();
    // Transform data for backend
    const brandData = {
      ...data,
      workingFields: data.workingFields
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean),
    };

    // TODO: Submit to backend
    // eslint-disable-next-line no-console
    console.log('Form submitted:', brandData);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfo control={control} />;
      case 1:
        return <LocationDetails control={control} />;
      case 2:
        return <ContactInfo control={control} />;
      case 3:
        return <WorkingHours control={control} setValue={setValue} />;
      case 4:
        return <Review control={control} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="safe-area" edges={['top']}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + (Platform.OS === 'ios' ? 50 : 90),
          paddingTop: Platform.OS === 'android' ? insets.top : 0,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 py-8">
          {/* Header */}
          <View className="mb-8 bg-primary/10 dark:bg-primary/20 p-6 rounded-3xl backdrop-blur-xl">
            <Text className="font-heading text-primary">Brand Setup</Text>
            <Text className="font-caption text-muted-foreground mt-2">
              Complete all steps to activate your brand
            </Text>
          </View>

          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} totalSteps={STEPS.length} />

          {/* Current Step Content */}
          <View className="my-8">{renderCurrentStep()}</View>

          {/* Navigation Buttons */}
          <View className="flex-row gap-4">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onPress={handleBack}
                className="flex-1 h-14 rounded-2xl bg-card/50 backdrop-blur-sm"
              >
                <Text className="font-subtitle">← Back</Text>
              </Button>
            )}
            {currentStep < STEPS.length - 1 ? (
              <Button onPress={handleNext} className="flex-1 h-14 rounded-2xl">
                <Text className="font-subtitle text-primary-foreground">
                  Next →
                </Text>
              </Button>
            ) : (
              <Button
                onPress={handleSubmit(onSubmit)}
                className="flex-1 h-14 rounded-2xl bg-primary"
              >
                <Text className="font-subtitle text-primary-foreground">
                  Submit ✓
                </Text>
              </Button>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SetUpStore;
