import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BlockedSheet, BlockedSheetRef } from '@/components/modals/block-sheet';
import KeyboardAvoid from '@/components/shared/keyboard-avoid';
import { Button, Text } from '@/components/ui';
import { useBecomeCreator } from '@/hooks/user/use-become-creator';
import { Feedback } from '@/lib/haptics';
import Icons from '@/lib/icons';
import { createBrandSchema, TCreateBrandInput } from '@/lib/validations/brand';
import { useUserStore } from '@/stores';
import { alert } from '@/stores/use-alert-store';
import { useBrandDraftStore } from '@/stores/use-brand-draft-store';
import {
  BasicInfo,
  ContactsInfo,
  LocationDetails,
  Review,
  StepIndicator,
} from '@/views/brand-profile/create-brand';

type SetupStep = 0 | 1 | 2 | 3;

const CreateBrand: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useUserStore();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState<SetupStep>(0);

  const sheetRef = useRef<BlockedSheetRef>(null);

  const STEPS = [
    { label: 'Basic Info', icon: Icons.FileText, id: '01' },
    { label: 'Location', icon: Icons.MapPin, id: '02' },
    { label: 'Contacts', icon: Icons.User, id: '03' },
    { label: 'Review', icon: Icons.CheckCircle, id: '04' },
  ];

  const {
    draftData,
    currentStep: savedStep,
    saveDraft,
    clearDraft,
    hasDraft,
  } = useBrandDraftStore();

  const { mutate: becomeCreator, isPending: isSubmitting } = useBecomeCreator();

  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    getValues,
    setFocus,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<TCreateBrandInput>({
    resolver: zodResolver(createBrandSchema),
    mode: 'onChange',
    defaultValues: {
      brandName: '',
      businessName: '',
      businessNumber: '',
      businessCertUrl: '',
      businessCategory: '',
      ownerFirstName: user?.firstName || '',
      ownerLastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      country: user?.country || '',
      state: user?.state || '',
      city: user?.city || '',
      street: user?.street || '',
      detailedAddress: user?.detailedAddress || '',
      postalCode: user?.postalCode || '',
      profileImage: undefined,
      bannerImage: undefined,
      description: undefined,
      workingFields: undefined,
    },
  });

  // Load draft data on mount
  useEffect(() => {
    if (hasDraft() && draftData) {
      Object.keys(draftData).forEach((key) => {
        if (draftData[key as keyof TCreateBrandInput]) {
          setValue(
            key as keyof TCreateBrandInput,
            draftData[key as keyof TCreateBrandInput],
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
        isStepValid = await trigger([
          'brandName',
          'businessName',
          'businessNumber',
          'businessCertUrl',
          'businessCategory',
        ]);
        break;
      case 1:
        isStepValid = await trigger([
          'country',
          'state',
          'city',
          'street',
          'detailedAddress',
          'postalCode',
        ]);
        break;
      case 2:
        isStepValid = await trigger([
          'phone',
          'ownerFirstName',
          'ownerLastName',
        ]);
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
      sheetRef.current?.show();
    } else {
      router.back();
    }
  };

  const onSubmit = (data: TCreateBrandInput) => {
    becomeCreator(data, {
      onSuccess: (message) => {
        Feedback.success();
        clearDraft();
        alert({
          title: t('brand.setup.success.title'),
          subtitle: t('brand.setup.success.message'),
          onConfirm: () => {
            router.replace('/(tabs)/(brand)/brand-profile');
            clearDraft();
            reset();
          },
        });
      },
    });
  };

  const renderCurrentStep = useMemo(() => {
    switch (currentStep) {
      case 0:
        return <BasicInfo control={control} setFocus={setFocus} />;
      case 1:
        return <LocationDetails control={control} setFocus={setFocus} />;
      case 2:
        return <ContactsInfo control={control} setFocus={setFocus} />;
      case 3:
        return <Review control={control} />;
      default:
        return null;
    }
  }, [currentStep, control, setFocus]);

  // Check if current step is valid
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 0:
        return (
          !errors.brandName &&
          !errors.businessName &&
          !errors.businessNumber &&
          !errors.businessCertUrl &&
          !errors.businessCategory
        );
      case 1:
        return (
          !errors.country &&
          !errors.state &&
          !errors.city &&
          !errors.street &&
          !errors.detailedAddress &&
          !errors.postalCode
        );
      case 2:
        return !errors.phone && !errors.ownerFirstName && !errors.ownerLastName;
      case 3:
        return isValid;
      default:
        return false;
    }
  };

  return (
    <KeyboardAvoid
      className="main-area"
      scrollConfig={{
        contentContainerStyle: {
          paddingTop: insets.top + 10,
          paddingBottom: insets.bottom + 50,
        },
      }}
    >
      {/* Custom Header with Back Button */}
      <View className="items-start mb-8">
        <Button
          variant="ghost"
          onPress={handleGoBack}
          disabled={isSubmitting}
          className="p-2 w-fit aspect-square rounded-full -ml-2"
        >
          <Icons.ArrowLeft size={24} className="text-card-foreground" />
        </Button>

        <View className="flex flex-col items-start gap-y-2 mt-6">
          <Text className="font-heading text-3xl">
            {t('brand.setup.title')}
          </Text>
          <Text className="font-regular text-muted-foreground">
            {t('brand.setup.subtitle')}
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
      <View className="flex-1">{renderCurrentStep}</View>

      {/* Navigation Buttons */}
      <View className="flex-row gap-4 mt-14 pt-6 border-t border-border/50">
        {currentStep > 0 && (
          <Button
            variant="outline"
            onPress={handleBack}
            disabled={isSubmitting}
            size="action"
            className="px-6"
          >
            <Text className="font-semibold text-foreground">
              {t('common.buttons.back')}
            </Text>
          </Button>
        )}
        {currentStep < STEPS.length - 1 ? (
          <Button
            onPress={handleNext}
            disabled={!isCurrentStepValid() || isSubmitting}
            size="action"
            className="flex-1"
          >
            <Text className="font-semibold text-primary-foreground">Next</Text>
          </Button>
        ) : (
          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || isSubmitting}
            size="action"
            className="flex-1"
          >
            <Text className="font-semibold text-primary-foreground">
              {isSubmitting ? 'Loading...' : 'Submit'}
            </Text>
          </Button>
        )}
      </View>
      <BlockedSheet
        ref={sheetRef}
        title="Save Draft?"
        subtitle="Do you want to save your progress?"
        cancelText="Cancel"
        confirmText="Save"
        onConfirm={() => {
          saveDraft(getValues(), currentStep);
          Feedback.success();
          router.back();
        }}
        onCancel={() => {
          clearDraft();
          router.back();
        }}
      />
    </KeyboardAvoid>
  );
};

export default CreateBrand;
