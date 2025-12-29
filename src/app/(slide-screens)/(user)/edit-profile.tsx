import { KeyboardAvoid } from '@/components/shared';
import { BlockedSheet, BlockedSheetRef } from '@/components/shared/block-sheet';
import FormField from '@/components/shared/form-field';
import { Header } from '@/components/shared/header';
import { Button, Input, PhoneInput, Text } from '@/components/ui';
import { useUpdateProfile } from '@/hooks/user/use-update-profile';
import { useUserStore } from '@/stores';
import { ProfileFormData, profileSchema } from '@/views/user/profile-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const EditProfileScreen = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const blockedSheetRef = useRef<BlockedSheetRef>(null);
  const { user } = useUserStore();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  // Form state
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
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
      // Only send changed fields
      const changedFields: Partial<ProfileFormData> = {};
      Object.keys(data).forEach((key) => {
        const fieldKey = key as keyof ProfileFormData;
        if (data[fieldKey] !== form.formState.defaultValues?.[fieldKey]) {
          changedFields[fieldKey] = data[fieldKey];
        }
      });

      updateProfile(changedFields, {
        onSuccess: () => {
          router.back();
        },
      });
    },
    [form.formState.defaultValues, updateProfile],
  );

  return (
    <KeyboardAvoid
      className="bg-background px-4"
      scrollConfig={{
        showsVerticalScrollIndicator: false,
        contentContainerStyle: {
          paddingBottom: insets.bottom + 80,
          paddingTop: 12,
          rowGap: 24,
        },
      }}
    >
      <Header
        title={t('profile.edit.title')}
        subtitle={t('profile.edit.subtitle')}
        className="mb-4"
        onGoBack={() => {
          if (isFormDirty) {
            blockedSheetRef.current?.show();
          } else {
            router.back();
          }
        }}
      />

      {/* Basic Information */}
      <View className="gap-4">
        <Text className="font-title text-lg text-foreground">
          {t('profile.edit.basicInfo')}
        </Text>

        <FormField
          required
          control={form.control}
          name="username"
          label={t('profile.username')}
          render={({ field }) => (
            <Input {...field} placeholder={t('profile.usernamePlaceholder')} />
          )}
        />

        <View className="flex-row gap-3">
          <FormField
            control={form.control}
            name="firstName"
            label={t('profile.firstName')}
            className="flex-1"
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ''}
                placeholder={t('profile.firstNamePlaceholder')}
              />
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            label={t('profile.lastName')}
            className="flex-1"
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ''}
                placeholder={t('profile.lastNamePlaceholder')}
              />
            )}
          />
        </View>
      </View>

      {/* Contact Information */}
      <View className="gap-4 pt-2">
        <Text className="font-title text-lg text-foreground">
          {t('profile.edit.contactInfo')}
        </Text>

        <FormField
          control={form.control}
          name="email"
          label={t('profile.email')}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value ?? ''}
              placeholder={t('profile.emailPlaceholder')}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          label={t('profile.phone')}
          render={({ field }) => (
            <PhoneInput
              {...field}
              value={field.value ?? ''}
              placeholder={t('profile.phonePlaceholder')}
            />
          )}
        />
      </View>

      {/* Address */}
      <View className="gap-4 pt-2">
        <Text className="font-title text-lg text-foreground">
          {t('profile.edit.address')}
        </Text>

        <FormField
          control={form.control}
          name="street"
          label={t('profile.street')}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value ?? ''}
              placeholder={t('profile.streetPlaceholder')}
            />
          )}
        />

        <FormField
          control={form.control}
          name="detailedAddress"
          label={t('profile.detailedAddress')}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value ?? ''}
              placeholder={t('profile.detailedAddressPlaceholder')}
            />
          )}
        />

        <View className="flex-row gap-3">
          <FormField
            control={form.control}
            name="city"
            label={t('profile.city')}
            className="flex-1"
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ''}
                placeholder={t('profile.cityPlaceholder')}
              />
            )}
          />

          <FormField
            control={form.control}
            name="state"
            label={t('profile.state')}
            className="flex-1"
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ''}
                placeholder={t('profile.statePlaceholder')}
              />
            )}
          />
        </View>

        <View className="flex-row gap-3">
          <FormField
            control={form.control}
            name="postalCode"
            label={t('profile.postalCode')}
            className="flex-1"
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ''}
                placeholder={t('profile.postalCodePlaceholder')}
              />
            )}
          />

          <FormField
            control={form.control}
            name="country"
            label={t('profile.country')}
            className="flex-1"
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ''}
                placeholder={t('profile.countryPlaceholder')}
              />
            )}
          />
        </View>
      </View>

      {/* Preferences */}
      <View className="gap-4 pt-2">
        <Text className="font-title text-lg text-foreground">
          {t('profile.edit.preferences')}
        </Text>

        <FormField
          control={form.control}
          name="preferredLocation"
          label={t('profile.preferredLocation')}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value ?? ''}
              placeholder={t('profile.preferredLocationPlaceholder')}
            />
          )}
        />
      </View>

      {/* Action Buttons */}
      <View className="mt-4">
        <Button
          onPress={form.handleSubmit(handleSave)}
          disabled={!isFormDirty || isPending}
          size="action"
        >
          <Text>
            {isPending ? t('common.saving') : t('common.buttons.saveChanges')}
          </Text>
        </Button>
      </View>

      <BlockedSheet
        ref={blockedSheetRef}
        onCancel={() => router.back()}
        onConfirm={() => blockedSheetRef.current?.hide()}
      />
    </KeyboardAvoid>
  );
};

export default EditProfileScreen;
