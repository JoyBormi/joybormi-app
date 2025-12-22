import KeyboardAvoid from '@/components/shared/keyboard-avoid';
import { Button, Text } from '@/components/ui';
import { Feedback } from '@/lib/haptics';
import Icons from '@/lib/icons';
import { BrandFormData, brandFormSchema } from '@/lib/validations/brand';
import { useBrandDraftStore } from '@/stores/use-brand-draft-store';
import {
  BasicInfo,
  ContactLegalInfo,
  LocationDetails,
  OwnerInfo,
  Review,
  StepIndicator,
} from '@/views/store/set-up';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, View } from 'react-native';
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
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<SetupStep>(0);

  const {
    draftData,
    currentStep: savedStep,
    saveDraft,
    clearDraft,
    hasDraft,
  } = useBrandDraftStore();

  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    getValues,
    formState: { errors, isValid, isDirty },
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

  // Load draft data on mount
  useEffect(() => {
    if (hasDraft() && draftData) {
      Object.keys(draftData).forEach((key) => {
        if (draftData[key as keyof BrandFormData]) {
          setValue(
            key as keyof BrandFormData,
            draftData[key as keyof BrandFormData],
          );
        }
      });
      setCurrentStep(savedStep as SetupStep);
    }
  }, [draftData, hasDraft, savedStep, setValue]);

  const handleNext = async () => {
    let isStepValid = false;

    // Validate current step before proceeding
    switch (currentStep) {
      case 0:
        isStepValid = await trigger(['brandName', 'businessCategory']);
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
        const nextStep = (currentStep + 1) as SetupStep;
        setCurrentStep(nextStep);
        // Auto-save draft
        saveDraft(getValues(), nextStep);
      }
    } else {
      Feedback.light();
    }
  };

  const handleBack = () => {
    Feedback.light();
    if (currentStep > 0) {
      const prevStep = (currentStep - 1) as SetupStep;
      setCurrentStep(prevStep);
      // Auto-save draft
      saveDraft(getValues(), prevStep);
    }
  };

  const handleGoBack = () => {
    if (isDirty || hasDraft()) {
      Alert.alert(
        'Save Draft?',
        'Do you want to save your progress?',
        [
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              clearDraft();
              router.back();
            },
          },
          {
            text: 'Save',
            onPress: () => {
              saveDraft(getValues(), currentStep);
              Feedback.success();
              router.back();
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        { cancelable: true },
      );
    } else {
      router.back();
    }
  };

  const onSubmit = (data: BrandFormData) => {
    Feedback.success();
    // TODO: Submit to backend API
    // eslint-disable-next-line no-console
    console.log('Brand form submitted:', data);
    clearDraft();
    // TODO: Navigate to success screen or brand dashboard
    router.back();
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
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <KeyboardAvoid
        className="main-area"
        scrollConfig={{
          keyboardShouldPersistTaps: 'handled',
          showsVerticalScrollIndicator: false,
          contentContainerStyle: {
            paddingTop: insets.top + 10,
            paddingBottom: insets.bottom + 100,
          },
        }}
      >
        {/* Custom Header with Back Button */}
        <View className=" items-start pl-2 mb-6">
          <Button
            variant="ghost"
            onPress={handleGoBack}
            className="p-2 w-fit aspect-square rounded-full !pl-0"
          >
            <Icons.ArrowLeft size={20} className="text-popover-foreground" />
          </Button>

          <View className="flex flex-col items-start gap-y-1 mt-5">
            <Text className="font-heading">Brand Setup</Text>
            <Text className="font-regular text-card-foreground pl-0.5">
              Complete all steps to register your brand
            </Text>
          </View>
        </View>

        {/* Step Indicator */}
        <StepIndicator
          currentStep={currentStep}
          totalSteps={STEPS.length}
          steps={STEPS}
        />

        {/* Current Step Content */}
        <View className="my-6">{renderCurrentStep}</View>

        {/* Navigation Buttons */}
        <View className="flex-row gap-3 mt-auto pt-4">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onPress={handleBack}
              className="flex-1 h-14 rounded-xl border-2"
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
              className="flex-1 h-14 rounded-xl"
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
              className="flex-1 h-14 rounded-xl"
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
