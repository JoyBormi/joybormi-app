import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icons from '@/components/icons';
import { BlockModal, BlockModalRef } from '@/components/modals/block-modal';
import { KeyboardAvoid } from '@/components/shared';
import FormField from '@/components/shared/form-field';
import { Header } from '@/components/shared/header';
import { Button, Input, NumberInput, PhoneInput, Text } from '@/components/ui';
import {
  useSendPhoneOtp,
  useVerifyEmail,
  useVerifyPhoneOtp,
} from '@/hooks/auth';
import { useOtpVerification } from '@/hooks/common';
import { useTimer } from '@/hooks/common/use-timer';
import { useUpdateProfile } from '@/hooks/user/use-update-profile';
import { toast } from '@/providers/toaster';
import { useUserStore } from '@/stores';
import { EUserMethod } from '@/types/user.type';
import { emptyLocalEmail, normalizeNumber } from '@/utils/helpers';
import { ProfileFormData, profileSchema } from '@/views/user/profile-schema';

const EditProfileScreen = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const insets = useSafeAreaInsets();
  const blockedSheetRef = useRef<BlockModalRef>(null);

  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { mutateAsync: sendPhoneOtp, isPending: isSendingPhoneOtp } =
    useSendPhoneOtp();
  const { mutateAsync: verifyPhoneOtp, isPending: isVerifyingPhoneOtp } =
    useVerifyPhoneOtp();
  const { mutateAsync: verifyEmail, isPending: isVerifyingEmail } =
    useVerifyEmail();

  const phoneTimer = useTimer();
  const emailTimer = useTimer();

  // Form state
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username ?? '',
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      emailOtp: '',
      phoneOtp: '',
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

  // Watch form values
  const watched = useWatch({
    control: form.control,
    name: ['email', 'phone', 'emailOtp', 'phoneOtp'],
  });

  const [emailValue, phoneValue, emailOtp, phoneOtp] = watched.map(
    (value) => value ?? '',
  ) as [string, string, string, string];

  // Normalize and compare values
  const normalized = useMemo(() => {
    const currentEmail = emptyLocalEmail(emailValue);
    const currentPhone = normalizeNumber(phoneValue) || '';
    const userEmail = emptyLocalEmail(user?.email ?? '');
    const userPhone = normalizeNumber(user?.phone ?? '') || '';

    return {
      currentEmail,
      currentPhone,
      userEmail,
      userPhone,
    };
  }, [emailValue, phoneValue, user?.email, user?.phone]);

  const emailVerification = useOtpVerification<ProfileFormData>({
    currentValue: normalized.currentEmail,
    originalValue: normalized.userEmail,
    otpValue: emailOtp,
    otpFieldName: 'emailOtp',
    setValue: form.setValue,
    timer: emailTimer,
  });

  const phoneVerification = useOtpVerification<ProfileFormData>({
    currentValue: normalized.currentPhone,
    originalValue: normalized.userPhone,
    otpValue: phoneOtp,
    otpFieldName: 'phoneOtp',
    setValue: form.setValue,
    timer: phoneTimer,
  });

  const needsEmailVerification = emailVerification.needsVerification;
  const needsPhoneVerification = phoneVerification.needsVerification;
  const isEmailVerified = emailVerification.isVerified;
  const isPhoneVerified = phoneVerification.isVerified;

  const handleSave = useCallback(
    (data: ProfileFormData) => {
      if (!isEmailVerified) {
        toast.error({ title: 'Please verify your email to continue.' });
        return;
      }
      if (!isPhoneVerified) {
        toast.error({ title: 'Please verify your phone number to continue.' });
        return;
      }

      // Only send changed fields
      const changedFields: Partial<ProfileFormData> = {};
      Object.keys(data).forEach((key) => {
        const fieldKey = key as keyof ProfileFormData;
        if (fieldKey === 'emailOtp' || fieldKey === 'phoneOtp') return;
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
    [
      form.formState.defaultValues,
      isEmailVerified,
      isPhoneVerified,
      updateProfile,
    ],
  );

  const handleSendPhoneOtp = useCallback(async () => {
    if (!normalized.currentPhone) {
      toast.error({ title: 'Enter a valid phone number first.' });
      return;
    }
    await sendPhoneOtp({ phoneNumber: normalized.currentPhone });
    phoneTimer.start(60);
    toast.success({ title: 'Verification code sent.' });
  }, [normalized.currentPhone, sendPhoneOtp, phoneTimer]);

  const handleSendEmailOtp = useCallback(async () => {
    if (!normalized.currentEmail) {
      toast.error({ title: 'Enter a valid email first.' });
      return;
    }
    // TODO: wire to email send endpoint if/when available
    emailTimer.start(60);
    toast.success({ title: 'Verification code sent.' });
  }, [normalized.currentEmail, emailTimer]);

  const handleVerifyPhone = useCallback(async () => {
    if (!normalized.currentPhone || !phoneOtp) return;
    await verifyPhoneOtp({
      phoneNumber: normalized.currentPhone,
      code: phoneOtp,
      disableSession: false,
      updatePhoneNumber: true,
    });
    phoneVerification.markVerified();
    toast.success({ title: 'Phone verified.' });
  }, [normalized.currentPhone, phoneOtp, phoneVerification, verifyPhoneOtp]);

  const handleVerifyEmail = useCallback(async () => {
    if (!normalized.currentEmail || !emailOtp) return;
    await verifyEmail({
      email: normalized.currentEmail,
      code: emailOtp,
      disableSession: false,
      updateEmail: true,
    });
    emailVerification.markVerified();
    toast.success({ title: 'Email verified.' });
  }, [emailOtp, emailVerification, normalized.currentEmail, verifyEmail]);

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
            <View className="flex-row items-center gap-2">
              <Input
                value={emptyLocalEmail(field.value ?? '')}
                onChangeText={field.onChangeText}
                editable={user?.userMethod === EUserMethod.PHONE}
                placeholder={t('settings.profile.emailPlaceholder')}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                className="flex-1"
                onSubmitEditing={() => form.setFocus('phone')}
              />
              {isEmailVerified && needsEmailVerification ? (
                <View className="h-12 items-center justify-center px-4">
                  <Icons.CheckCircle size={24} className="text-success" />
                </View>
              ) : (
                <Button
                  size="lg"
                  onPress={handleSendEmailOtp}
                  disabled={
                    !needsEmailVerification ||
                    !normalized.currentEmail ||
                    emailTimer.seconds > 0 ||
                    isSendingPhoneOtp
                  }
                >
                  <Text>
                    {emailTimer.seconds > 0
                      ? emailTimer.formatted
                      : emailTimer.hasStarted
                        ? t('common.buttons.resend')
                        : t('common.buttons.send')}
                  </Text>
                </Button>
              )}
            </View>
          )}
        />

        {needsEmailVerification &&
          !isEmailVerified &&
          emailTimer.hasStarted && (
            <FormField
              control={form.control}
              name="emailOtp"
              label={t('settings.profile.emailOtp')}
              render={({ field }) => (
                <View className="flex-row items-center gap-2">
                  <NumberInput
                    {...field}
                    onSubmitEditing={handleVerifyEmail}
                    returnKeyType="done"
                    className="flex-1"
                    placeholder="Enter email code"
                  />
                  <Button
                    size="lg"
                    onPress={handleVerifyEmail}
                    disabled={!emailOtp || isVerifyingEmail}
                  >
                    <Text>
                      {isVerifyingEmail
                        ? t('common.buttons.loading')
                        : t('common.buttons.verify')}
                    </Text>
                  </Button>
                </View>
              )}
            />
          )}

        <FormField
          control={form.control}
          name="phone"
          label={t('settings.profile.phone')}
          render={({ field }) => (
            <View className="flex-row items-center gap-2">
              <PhoneInput
                {...field}
                placeholder={t('settings.profile.phonePlaceholder')}
                value={field.value ?? ''}
                returnKeyType="next"
                className="flex-1"
                onSubmitEditing={() => form.setFocus('street')}
              />

              {isPhoneVerified && needsPhoneVerification ? (
                <View className="h-12 items-center justify-center px-4">
                  <Icons.CheckCircle size={24} className="text-success" />
                </View>
              ) : (
                <Button
                  size="lg"
                  onPress={handleSendPhoneOtp}
                  disabled={
                    !needsPhoneVerification ||
                    !normalized.currentPhone ||
                    phoneTimer.seconds > 0 ||
                    isSendingPhoneOtp
                  }
                >
                  <Text>
                    {phoneTimer.seconds > 0
                      ? phoneTimer.formatted
                      : phoneTimer.hasStarted
                        ? t('common.buttons.resend')
                        : t('common.buttons.send')}
                  </Text>
                </Button>
              )}
            </View>
          )}
        />

        {needsPhoneVerification &&
          !isPhoneVerified &&
          phoneTimer.hasStarted && (
            <FormField
              control={form.control}
              name="phoneOtp"
              label={t('settings.profile.phoneOtp')}
              render={({ field }) => (
                <View className="flex-row items-center gap-2">
                  <NumberInput
                    {...field}
                    onSubmitEditing={handleVerifyPhone}
                    returnKeyType="done"
                    className="flex-1"
                    placeholder="Enter phone code"
                  />
                  <Button
                    size="lg"
                    onPress={handleVerifyPhone}
                    disabled={!phoneOtp || isVerifyingPhoneOtp}
                  >
                    <Text>
                      {isVerifyingPhoneOtp
                        ? t('common.buttons.loading')
                        : t('common.buttons.verify')}
                    </Text>
                  </Button>
                </View>
              )}
            />
          )}
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
