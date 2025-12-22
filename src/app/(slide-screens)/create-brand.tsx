import { Header } from '@/components/shared/header';
import KeyboardAvoid from '@/components/shared/keyboard-avoid';
import { Button, Text } from '@/components/ui';
import { Feedback } from '@/lib/haptics';
import Icons from '@/lib/icons';
import { BrandFormData, brandFormSchema } from '@/lib/validations/brand';
import {
  BasicInfo,
  ContactLegalInfo,
  LocationDetails,
  OwnerInfo,
  Review,
  StepIndicator,
} from '@/views/store/set-up';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

type SetupStep = 0 | 1 | 2 | 3 | 4;

const STEPS = [
  { label: 'Basic Info', icon: Icons.FileText, id: '01' },
  { label: 'Location', icon: Icons.MapPin, id: '02' },
  { label: 'Contact & Legal', icon: Icons.Shield, id: '03' },
  { label: 'Owner Info', icon: Icons.User, id: '04' },
  { label: 'Review', icon: Icons.CheckCircle, id: '05' },
];

const CreateBrand: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState<SetupStep>(0);

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors, isValid },
  } = useForm<BrandFormData>({
    resolver: zodResolver(brandFormSchema),
    mode: 'onChange',
    defaultValues: {
      brandName: '',
      description: '',
      businessCategory: '',
      country: '',
      state: '',
      city: '',
      street: '',
      detailedAddress: '',
      postalCode: '',
      email: '',
      phone: '',
      businessRegistrationNumber: '',
      licenseDocument: '',
      ownerFirstName: '',
      ownerLastName: '',
    },
  });

  const handleNext = async () => {
    let isStepValid = false;

    // Validate current step before proceeding
    switch (currentStep) {
      case 0:
        isStepValid = await trigger([
          'brandName',
          'description',
          'businessCategory',
        ]);
        break;
      case 1:
        isStepValid = await trigger([
          'country',
          'state',
          'street',
          'postalCode',
        ]);
        break;
      case 2:
        isStepValid = await trigger([
          'email',
          'phone',
          'businessRegistrationNumber',
        ]);
        break;
      case 3:
        isStepValid = await trigger(['ownerFirstName', 'ownerLastName']);
        break;
      default:
        isStepValid = true;
    }

    if (isStepValid) {
      Feedback.light();
      if (currentStep < STEPS.length - 1) {
        setCurrentStep((currentStep + 1) as SetupStep);
      }
    } else {
      Feedback.light();
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
    // TODO: Submit to backend API
    // eslint-disable-next-line no-console
    console.log('Brand form submitted:', data);
    // TODO: Navigate to success screen or brand dashboard
  };

  const renderCurrentStep = useMemo(() => {
    switch (currentStep) {
      case 0:
        return <BasicInfo control={control} />;
      case 1:
        return <LocationDetails control={control} />;
      case 2:
        return <ContactLegalInfo control={control} />;
      case 3:
        return <OwnerInfo control={control} />;
      case 4:
        return <Review control={control} />;
      default:
        return null;
    }
  }, [currentStep, control]);

  // Check if current step is valid
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 0:
        return !errors.brandName && !errors.businessCategory;
      case 1:
        return (
          !errors.country &&
          !errors.state &&
          !errors.street &&
          !errors.postalCode
        );
      case 2:
        return (
          !errors.email && !errors.phone && !errors.businessRegistrationNumber
        );
      case 3:
        return !errors.ownerFirstName && !errors.ownerLastName;
      case 4:
        return isValid;
      default:
        return false;
    }
  };

  return (
    <SafeAreaView className="safe-area" edges={['top']}>
      <KeyboardAvoid
        className="main-area"
        scrollConfig={{
          keyboardShouldPersistTaps: 'handled',
          showsVerticalScrollIndicator: false,
          contentContainerStyle: {
            paddingTop: insets.top,
            paddingBottom: insets.bottom + 20,
          },
        }}
      >
        {/* Header */}
        <Header
          title="Brand Setup"
          subtitle="Complete all steps to register and activate your brand on the platform"
        />

        {/* Step Indicator */}
        <StepIndicator
          currentStep={currentStep}
          totalSteps={STEPS.length}
          steps={STEPS}
        />

        {/* Current Step Content */}
        <View className="my-6">{renderCurrentStep}</View>

        {/* Navigation Buttons */}
        <View className="flex-row gap-3 mt-4">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onPress={handleBack}
              className="flex-1 h-14 rounded-2xl border-2 border-border/50"
            >
              <View className="flex-row items-center gap-2">
                <Icons.ChevronLeft className="text-foreground" size={20} />
                <Text className="text-base font-semibold text-foreground">
                  Back
                </Text>
              </View>
            </Button>
          )}
          {currentStep < STEPS.length - 1 ? (
            <Button
              onPress={handleNext}
              disabled={!isCurrentStepValid()}
              className="flex-1 h-14 rounded-2xl"
            >
              <View className="flex-row items-center gap-2">
                <Text className="text-base font-semibold text-primary-foreground">
                  Next
                </Text>
                <Icons.ChevronRight
                  className="text-primary-foreground"
                  size={20}
                />
              </View>
            </Button>
          ) : (
            <Button
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid}
              className="flex-1 h-14 rounded-2xl"
            >
              <View className="flex-row items-center gap-2">
                <Icons.CheckCircle
                  className="text-primary-foreground"
                  size={20}
                />
                <Text className="text-base font-semibold text-primary-foreground">
                  Submit
                </Text>
              </View>
            </Button>
          )}
        </View>
      </KeyboardAvoid>
    </SafeAreaView>
  );
};

export default CreateBrand;
