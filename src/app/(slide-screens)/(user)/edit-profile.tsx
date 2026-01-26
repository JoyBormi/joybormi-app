import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BlockModal, BlockModalRef } from '@/components/modals/block-modal';
import { KeyboardAvoid } from '@/components/shared';
import FormField from '@/components/shared/form-field';
import { Header } from '@/components/shared/header';
import { Button, Input, PhoneInput, Text } from '@/components/ui';
import { useUpdateProfile } from '@/hooks/user/use-update-profile';
import { useUserStore } from '@/stores';
import { EUserMethod } from '@/types/user.type';
import { emptyLocalEmail } from '@/utils/helpers';
import { ProfileFormData, profileSchema } from '@/views/user/profile-schema';

const EditProfileScreen = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const insets = useSafeAreaInsets();
  const blockedSheetRef = useRef<BlockModalRef>(null);

  const [identifier, setIdentifier] = useState<string>('');

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
        title={t('settings.profile.edit.title')}
        subtitle={t('settings.profile.edit.subtitle')}
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
                onSubmitEditing={() => form.setFocus('email')}
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

        <FormField
          control={form.control}
          name="email"
          label={t('settings.profile.email')}
          render={({ field }) => (
            <Input
              value={emptyLocalEmail(field.value ?? '')}
              onChangeText={field.onChangeText}
              editable={user?.userMethod === EUserMethod.PHONE}
              placeholder={t('settings.profile.emailPlaceholder')}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => form.setFocus('phone')}
            />
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          label={t('settings.profile.phone')}
          render={({ field }) => (
            <PhoneInput
              {...field}
              editable={user?.userMethod === EUserMethod.EMAIL}
              placeholder={t('settings.profile.phonePlaceholder')}
              value={field.value ?? ''}
              returnKeyType="next"
              onSubmitEditing={() => form.setFocus('street')}
            />
          )}
        />
      </View>

      {/* Address */}
      <View className="gap-4 pt-2">
        <Text className="font-title text-lg text-foreground">
          {t('settings.profile.edit.address')}
        </Text>

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
            name="state"
            label={t('settings.profile.state')}
            className="flex-1"
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ''}
                placeholder={t('settings.profile.statePlaceholder')}
                returnKeyType="next"
                onSubmitEditing={() => form.setFocus('postalCode')}
              />
            )}
          />
        </View>

        <View className="flex-row gap-3">
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

          <FormField
            control={form.control}
            name="country"
            label={t('settings.profile.country')}
            className="flex-1"
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ''}
                placeholder={t('settings.profile.countryPlaceholder')}
                returnKeyType="next"
                onSubmitEditing={() => form.setFocus('preferredLocation')}
              />
            )}
          />
        </View>
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
            <Input
              {...field}
              value={field.value ?? ''}
              placeholder={t('settings.profile.preferredLocationPlaceholder')}
              returnKeyType="done"
              onSubmitEditing={() => form.handleSubmit(handleSave)}
            />
          )}
        />
      </View>

      {/* Action Buttons */}
      <View className="mt-4">
        <Button
          onPress={form.handleSubmit(handleSave)}
          disabled={!isFormDirty || isPending}
          size="lg"
        >
          <Text>
            {isPending ? t('common.buttons.saving') : t('common.buttons.save')}
          </Text>
        </Button>
      </View>

      <BlockModal
        ref={blockedSheetRef}
        onCancel={() => router.back()}
        onConfirm={() => blockedSheetRef.current?.hide()}
      />
    </KeyboardAvoid>
  );
};

export default EditProfileScreen;
