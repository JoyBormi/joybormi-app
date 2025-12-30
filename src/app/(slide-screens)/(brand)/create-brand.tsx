import KeyboardAvoid from '@/components/shared/keyboard-avoid';
import { Button, Text } from '@/components/ui';
import { useBecomeCreator } from '@/hooks/user/use-become-creator';
import { Feedback } from '@/lib/haptics';
import Icons from '@/lib/icons';
import { createBrandSchema, TCreateBrandInput } from '@/lib/validations/brand';
import { useUserStore } from '@/stores';
import { useBrandDraftStore } from '@/stores/use-brand-draft-store';
import {
  BasicInfo,
  ContactLegalInfo,
  LocationDetails,
  OwnerInfo,
  Review,
  StepIndicator,
} from '@/views/brand-profile/create-brand';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SetupStep = 0 | 1 | 2 | 3 | 4;

const CreateBrand: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useUserStore();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState<SetupStep>(0);

  const STEPS = [
    { label: t('brand.setup.steps.basicInfo'), icon: Icons.FileText, id: '01' },
    { label: t('brand.setup.steps.location'), icon: Icons.MapPin, id: '02' },
    {
      label: t('brand.setup.steps.contactLegal'),
      icon: Icons.Shield,
      id: '03',
    },
    { label: t('brand.setup.steps.ownerInfo'), icon: Icons.User, id: '04' },
    { label: t('brand.setup.steps.review'), icon: Icons.CheckCircle, id: '05' },
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
    formState: { errors, isValid, isDirty },
  } = useForm<TCreateBrandInput>({
    resolver: zodResolver(createBrandSchema),
    mode: 'onChange',
    defaultValues: {
      brandName: '',
      businessName: '',
      businessNumber: '',
      businessCertUrl: '',
      businessCategory: undefined,
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
          'email',
          'phone',
          'businessNumber',
          'businessCertUrl',
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
        t('brand.setup.saveDraft.title'),
        t('brand.setup.saveDraft.message'),
        [
          {
            text: t('brand.setup.saveDraft.discard'),
            style: 'destructive',
            onPress: () => {
              clearDraft();
              router.back();
            },
          },
          {
            text: t('brand.setup.saveDraft.save'),
            onPress: () => {
              saveDraft(getValues(), currentStep);
              Feedback.success();
              router.back();
            },
          },
          {
            text: t('common.buttons.cancel'),
            style: 'cancel',
          },
        ],
        { cancelable: true },
      );
    } else {
      router.back();
    }
  };

  const onSubmit = (data: TCreateBrandInput) => {
    becomeCreator(data, {
      onSuccess: (message) => {
        Feedback.success();
        clearDraft();
        Alert.alert(
          t('brand.setup.success.title'),
          t('brand.setup.success.message'),
          [
            {
              text: t('common.buttons.ok'),
              onPress: () => router.replace('/(tabs)/(brand)/brand-profile'),
            },
          ],
        );
      },
      onError: (error) => {
        Feedback.heavy();
        Alert.alert(
          t('common.error.title'),
          error.message || t('brand.setup.error.message'),
        );
      },
    });
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
        return !errors.phone;
      case 3:
        return !errors.ownerFirstName && !errors.ownerLastName;
      case 4:
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
          <Icons.ArrowLeft size={24} className="text-popover-foreground" />
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
      <View className="mb-8">
        <StepIndicator
          currentStep={currentStep}
          totalSteps={STEPS.length}
          steps={STEPS}
        />
      </View>

      {/* Current Step Content */}
      <View className="flex-1 mb-6">{renderCurrentStep}</View>

      {/* Navigation Buttons */}
      <View className="flex-row gap-4 mt-8 pt-6 border-t border-border/50">
        {currentStep > 0 && (
          <Button
            variant="outline"
            onPress={handleBack}
            disabled={isSubmitting}
            className="flex-1 h-12 rounded-2xl"
          >
            <View className="flex-row items-center gap-2">
              <Icons.ChevronLeft className="text-foreground" size={20} />
              <Text className="font-semibold text-foreground">
                {t('common.buttons.back')}
              </Text>
            </View>
          </Button>
        )}
        {currentStep < STEPS.length - 1 ? (
          <Button
            onPress={handleNext}
            disabled={!isCurrentStepValid() || isSubmitting}
            className="flex-1 h-12 rounded-2xl"
          >
            <View className="flex-row items-center gap-2">
              <Text className="font-semibold text-primary-foreground">
                {t('brand.setup.buttons.next')}
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
            disabled={!isValid || isSubmitting}
            className="flex-1 h-12 rounded-2xl"
          >
            <View className="flex-row items-center gap-2">
              {isSubmitting ? (
                <Icons.RefreshCcw
                  className="text-primary-foreground"
                  size={20}
                />
              ) : (
                <Icons.CheckCircle
                  className="text-primary-foreground"
                  size={20}
                />
              )}
              <Text className="font-semibold text-primary-foreground">
                {isSubmitting
                  ? t('common.buttons.loading')
                  : t('brand.setup.buttons.submit')}
              </Text>
            </View>
          </Button>
        )}
      </View>
    </KeyboardAvoid>
  );
};

export default CreateBrand;
