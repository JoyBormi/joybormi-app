import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icons from '@/components/icons';
import { KeyboardAvoid } from '@/components/shared';
import FormField from '@/components/shared/form-field';
import { Header } from '@/components/shared/header';
import { Button, Input, NumberInput, PhoneInput, Text } from '@/components/ui';
import { routes } from '@/constants/routes';
import {
  useChangeEmail,
  useSendEmailVerify,
  useSendPhoneOtp,
  useVerifyPhoneOtp,
} from '@/hooks/auth';
import { useTimer } from '@/hooks/common/use-timer';
import { normalizePhone } from '@/lib/utils';
import {
  ContactVerificationFormData,
  createContactVerificationSchema,
} from '@/lib/validation';
import { toast } from '@/providers/toaster';
import { useUserStore } from '@/stores';
import { EUserMethod } from '@/types/user.type';
import { emptyLocalEmail } from '@/utils/helpers';

export default function SecurityScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { user } = useUserStore();

  const isPhoneMethod = user?.userMethod === EUserMethod.PHONE;
  const isEmailMethod = !isPhoneMethod;

  const contactSchema = useMemo(
    () => createContactVerificationSchema(user?.userMethod),
    [user?.userMethod],
  );

  const form = useForm<ContactVerificationFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      phoneOtp: '',
    },
  });

  const [emailValue = '', phoneValue = '', phoneOtp = ''] = useWatch({
    control: form.control,
    name: ['email', 'phone', 'phoneOtp'],
  });

  const normalized = useMemo(() => {
    return {
      currentEmail: emptyLocalEmail(emailValue),
      currentPhone: normalizePhone(phoneValue) || '',
      userEmail: emptyLocalEmail(user?.email ?? ''),
      userPhone: normalizePhone(user?.phone ?? '') || '',
    };
  }, [emailValue, phoneValue, user]);

  const emailHasChanged =
    !!normalized.currentEmail &&
    normalized.currentEmail !== normalized.userEmail;

  const phoneHasChanged =
    !!normalized.currentPhone &&
    normalized.currentPhone !== normalized.userPhone;

  const emailIsVerified =
    user && user?.emailVerified === true && !emailHasChanged;

  const phoneIsVerified =
    user && user?.phoneNumberVerified === true && !phoneHasChanged;

  const emailTimer = useTimer();
  const phoneTimer = useTimer();

  const { mutateAsync: changeEmail, isPending: isChangingEmail } =
    useChangeEmail();

  const { mutateAsync: sendEmailVerify, isPending: isSendingEmailVerify } =
    useSendEmailVerify();

  const { mutateAsync: sendPhoneOtp, isPending: isSendingPhoneOtp } =
    useSendPhoneOtp();

  const { mutateAsync: verifyPhoneOtp, isPending: isVerifyingPhoneOtp } =
    useVerifyPhoneOtp();

  /* ───────── ACTIONS ───────── */

  const handleChangeEmail = useCallback(async () => {
    const valid = await form.trigger('email');
    if (!valid || !normalized.currentEmail) return;

    await changeEmail({
      newEmail: normalized.currentEmail,
      callbackURL: 'joy-bormi-app://verify-email',
    });

    toast.success({ title: 'Email change started' });
  }, [changeEmail, form, normalized.currentEmail]);

  const handleSendEmailVerification = useCallback(async () => {
    const valid = await form.trigger('email');
    if (!valid) return;

    await sendEmailVerify({ email: normalized.currentEmail });
    emailTimer.start(60);
  }, [emailTimer, form, normalized.currentEmail, sendEmailVerify]);

  const handleSendPhoneOtp = useCallback(async () => {
    const valid = await form.trigger('phone');
    if (!valid || !normalized.currentPhone) return;

    await sendPhoneOtp({ phoneNumber: normalized.currentPhone });
    phoneTimer.start(60);
  }, [form, normalized.currentPhone, phoneTimer, sendPhoneOtp]);

  const handleVerifyPhone = useCallback(async () => {
    if (!phoneOtp) return;

    await verifyPhoneOtp({
      phoneNumber: normalized.currentPhone,
      code: phoneOtp,
      disableSession: false,
      updatePhoneNumber: true,
    });

    toast.success({ title: 'Phone verified' });
  }, [normalized.currentPhone, phoneOtp, verifyPhoneOtp]);

  /* ───────── UI ───────── */

  return (
    <KeyboardAvoid
      className="main-area"
      contentContainerStyle={{
        paddingTop: 16,
        paddingBottom: insets.bottom + 32,
        rowGap: 40,
      }}
    >
      <Header
        title={t('settings.pages.security.title')}
        subtitle={t('settings.pages.security.description')}
      />

      {/* EMAIL */}
      {isEmailMethod && (
        <View className="gap-sm">
          <View className="flex-row items-center justify-between">
            <Text className="font-subtitle text-muted-foreground">
              Email Address
            </Text>
            {emailIsVerified ? (
              <Icons.CheckCircle2 size={20} className="text-success" />
            ) : (
              <Icons.ShieldAlert size={20} className="text-warning" />
            )}
          </View>

          <FormField
            control={form.control}
            name="email"
            message={
              !emailIsVerified && !emailHasChanged
                ? 'You must verify this email.'
                : undefined
            }
            render={({ field }) => (
              <View className="flex-row items-center gap-sm">
                <Input
                  {...field}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                {!emailIsVerified && !emailHasChanged && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onPress={handleSendEmailVerification}
                    disabled={emailTimer.seconds > 0}
                    loading={isSendingEmailVerify}
                  >
                    <Text>
                      {emailTimer.seconds > 0
                        ? `Resend in ${emailTimer.formatted}`
                        : 'Send'}
                    </Text>
                  </Button>
                )}
              </View>
            )}
          />

          {emailHasChanged && (
            <Button
              size="sm"
              onPress={handleChangeEmail}
              loading={isChangingEmail}
            >
              <Text>Save email</Text>
            </Button>
          )}
        </View>
      )}

      {/* PHONE */}
      {isPhoneMethod && (
        <View className="gap-sm">
          <View className="flex-row items-center justify-between">
            <Text className="font-subtitle text-muted-foreground">
              Phone Number
            </Text>
            {phoneIsVerified ? (
              <Icons.CheckCircle2 size={20} className="text-success" />
            ) : (
              <Icons.ShieldAlert size={20} className="text-warning" />
            )}
          </View>

          <FormField
            control={form.control}
            name="phone"
            message={
              !phoneIsVerified
                ? 'Verify your number to secure your account.'
                : undefined
            }
            render={({ field }) => (
              <View className="flex-row items-center gap-sm">
                <PhoneInput {...field} className="flex-1" />
                <Button
                  variant="outline"
                  className="h-14"
                  onPress={handleSendPhoneOtp}
                  disabled={phoneTimer.seconds > 0}
                  loading={isSendingPhoneOtp}
                >
                  <Text>
                    {phoneTimer.seconds > 0
                      ? `Wait ${phoneTimer.formatted}`
                      : 'Send code'}
                  </Text>
                </Button>
              </View>
            )}
          />

          {!phoneIsVerified && (
            <>
              {phoneTimer.hasStarted && (
                <View className="flex-row gap-md">
                  <FormField
                    control={form.control}
                    name="phoneOtp"
                    render={({ field }) => (
                      <NumberInput placeholder="SMS Code" {...field} />
                    )}
                  />
                  <Button
                    size="sm"
                    onPress={handleVerifyPhone}
                    loading={isVerifyingPhoneOtp}
                  >
                    <Text>Confirm</Text>
                  </Button>
                </View>
              )}
            </>
          )}
        </View>
      )}
      <View className="h-px bg-border/50" />

      {/* PASSWORD */}
      <View className="gap-sm">
        <Text className="font-subtitle uppercase text-muted-foreground">
          Password
        </Text>

        <Pressable
          onPress={() => router.push(routes.settings.security.change_password)}
          className="flex-row items-center justify-between border border-border p-sm rounded-md px-md"
        >
          <View className="gap-xs">
            <Text className="font-body text-foreground">Change Password</Text>
            <Text className="font-caption text-muted-foreground">
              Last updated 3 months ago
            </Text>
          </View>

          <Icons.ChevronRight size={18} className="text-muted-foreground" />
        </Pressable>
      </View>
    </KeyboardAvoid>
  );
}
