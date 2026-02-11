import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KeyboardAvoid } from '@/components/shared';
import FormField from '@/components/shared/form-field';
import { Header } from '@/components/shared/header';
import { Button, Input, PhoneInput, Select, Text } from '@/components/ui';
import { useUpdateProfile } from '@/hooks/user/use-update-profile';
import { createProfileSchema, ProfileFormData } from '@/lib/validation';
import { useUserStore } from '@/stores';
import { EUserMethod } from '@/types/user.type';

const EditProfileScreen = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const insets = useSafeAreaInsets();

  const isPhoneMethod = user?.userMethod === EUserMethod.PHONE;
  const isEmailMethod = !isPhoneMethod;

  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const profileValidationSchema = useMemo(
    () => createProfileSchema(user?.userMethod),
    [user?.userMethod],
  );

  // Form state
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileValidationSchema),
    defaultValues: {
      username: user?.username ?? '',
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      language: user?.language ?? '',
      country: user?.country ?? '',
      state: user?.state ?? '',
      city: user?.city ?? '',
      street: user?.street ?? '',
      postalCode: user?.postalCode ?? '',
      detailedAddress: user?.detailedAddress ?? '',
      preferredLocation: user?.preferredLocation ?? '',
    },
  });

  const isFormDirty = form.formState.isDirty;

  const handleSave = useCallback(
    (data: ProfileFormData) => {
      const hiddenContactField: keyof ProfileFormData = isPhoneMethod
        ? 'email'
        : 'phone';
      const dirtyFields = form.formState.dirtyFields;
      const changedFields: Partial<ProfileFormData> = {};

      Object.keys(dirtyFields).forEach((key) => {
        const fieldKey = key as keyof ProfileFormData;
        const isOtpField = fieldKey === 'emailOtp' || fieldKey === 'phoneOtp';
        if (isOtpField || fieldKey === hiddenContactField) return;
        changedFields[fieldKey] = data[fieldKey];
      });

      if (Object.keys(changedFields).length === 0) {
        router.back();
        return;
      }

      updateProfile(changedFields, {
        onSuccess: () => {
          router.back();
        },
      });
    },
    [form.formState.dirtyFields, isPhoneMethod, updateProfile],
  );

  return (
    <KeyboardAvoid
      className="main-area"
      contentContainerStyle={{
        paddingBottom: insets.bottom + 80,
        paddingTop: 12,
        rowGap: 24,
      }}
    >
      <Header
        title={t('settings.profile.edit.title')}
        subtitle={t('settings.profile.edit.subtitle')}
        className="mb-4"
      />

      {/* Basic Information */}
      <View className="gap-4">
        <Text className="font-title text-lg text-foreground">
          {t('settings.profile.edit.basicInfo')}
        </Text>

        <FormField
          required
          control={form.control}
          name="username"
          label={t('settings.profile.username')}
          render={({ field }) => (
            <Input
              {...field}
              placeholder={t('settings.profile.usernamePlaceholder')}
              returnKeyType="next"
              onSubmitEditing={() => form.setFocus('firstName')}
            />
          )}
        />

        <View className="flex-row gap-3">
          <FormField
            control={form.control}
            name="firstName"
            label={t('settings.profile.firstName')}
            className="flex-1"
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ''}
                placeholder={t('settings.profile.firstNamePlaceholder')}
                returnKeyType="next"
                onSubmitEditing={() => form.setFocus('lastName')}
              />
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            label={t('settings.profile.lastName')}
            className="flex-1"
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ''}
                placeholder={t('settings.profile.lastNamePlaceholder')}
                returnKeyType="next"
                onSubmitEditing={() => form.setFocus('country')}
              />
            )}
          />
        </View>
      </View>

      {/* Contact Information */}
      <View className="gap-4 pt-2">
        <Text className="font-title text-lg text-foreground">
          {t('settings.profile.edit.contactInfo')}
        </Text>
        {isEmailMethod && (
          <FormField
            control={form.control}
            name="email"
            label={t('settings.profile.email')}
            message="You have joined with this email address, update it to change your email in the settings"
            render={({ field }) => (
              <Input
                {...field}
                editable={false}
                placeholder={t('settings.profile.emailPlaceholder')}
              />
            )}
          />
        )}

        {isPhoneMethod && (
          <FormField
            control={form.control}
            name="phone"
            label={t('settings.profile.phone')}
            message="You have joined with this phone number, update it to change your phone number in the settings"
            render={({ field }) => (
              <PhoneInput
                {...field}
                placeholder={t('settings.profile.phonePlaceholder')}
                value={field.value ?? ''}
                editable={false}
              />
            )}
          />
        )}
      </View>

      {/* Address */}
      <View className="gap-4 pt-2">
        <Text className="font-title text-lg text-foreground">
          {t('settings.profile.edit.address')}
        </Text>

        <View className="flex-row gap-3">
          <FormField
            control={form.control}
            name="country"
            label={t('settings.profile.country')}
            className="flex-1"
            render={({ field }) => (
              <Select
                {...field}
                options={[{ value: 'UZB', label: 'Uzbekistan' }]}
                placeholder={t('settings.profile.countryPlaceholder')}
              />
            )}
          />
          <FormField
            control={form.control}
            name="state"
            label={t('settings.profile.state')}
            className="flex-1"
            render={({ field }) => (
              <Select
                {...field}
                options={[
                  { value: 'TOSHKENT', label: 'Toshkent' },
                  { value: 'SAMARQAND', label: 'Samarqand' },
                  { value: 'BUXORO', label: 'Buxoro' },
                ]}
                placeholder={t('settings.profile.statePlaceholder')}
              />
            )}
          />
        </View>

        <View className="flex-row gap-3">
          <FormField
            control={form.control}
            name="city"
            label={t('settings.profile.city')}
            className="flex-1"
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ''}
                placeholder={t('settings.profile.cityPlaceholder')}
                returnKeyType="next"
                onSubmitEditing={() => form.setFocus('state')}
              />
            )}
          />
          <FormField
            control={form.control}
            name="postalCode"
            label={t('settings.profile.postalCode')}
            className="flex-1"
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ''}
                placeholder={t('settings.profile.postalCodePlaceholder')}
                returnKeyType="next"
                onSubmitEditing={() => form.setFocus('country')}
              />
            )}
          />
        </View>

        <FormField
          control={form.control}
          name="street"
          label={t('settings.profile.street')}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value ?? ''}
              placeholder={t('settings.profile.streetPlaceholder')}
              returnKeyType="next"
              onSubmitEditing={() => form.setFocus('detailedAddress')}
            />
          )}
        />

        <FormField
          control={form.control}
          name="detailedAddress"
          label={t('settings.profile.detailedAddress')}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value ?? ''}
              placeholder={t('settings.profile.detailedAddressPlaceholder')}
              returnKeyType="next"
              onSubmitEditing={() => form.setFocus('city')}
            />
          )}
        />
      </View>

      {/* Preferences */}
      <View className="gap-4 pt-2">
        <Text className="font-title text-lg text-foreground">
          {t('settings.profile.edit.preferences')}
        </Text>

        <FormField
          control={form.control}
          name="preferredLocation"
          label={t('settings.profile.preferredLocation')}
          render={({ field }) => (
            <Select
              {...field}
              options={[
                { value: 'TOSHKENT', label: 'Toshkent' },
                { value: 'SAMARQAND', label: 'Samarqand' },
                { value: 'BUXORO', label: 'Buxoro' },
              ]}
              placeholder={t('settings.profile.preferredLocationPlaceholder')}
            />
          )}
        />
      </View>

      {/* Action Buttons */}

      <Button
        onPress={form.handleSubmit(handleSave)}
        disabled={!isFormDirty || isPending}
        loading={isPending}
        size="lg"
        className="self-end min-w-40 mt-4"
      >
        <Text>
          {isPending ? t('common.buttons.saving') : t('common.buttons.save')}
        </Text>
      </Button>
    </KeyboardAvoid>
  );
};

export default EditProfileScreen;
