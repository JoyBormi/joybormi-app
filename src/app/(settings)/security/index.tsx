import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icons from '@/components/icons';
import { KeyboardAvoid } from '@/components/shared';
import FormField from '@/components/shared/form-field';
import { Header } from '@/components/shared/header';
import { Button, Input, NumberInput, PhoneInput, Text } from '@/components/ui';
import {
  useSendEmailVerify,
  useSendPhoneOtp,
  useVerifyPhoneOtp,
} from '@/hooks/auth';
import { useTimer } from '@/hooks/common/use-timer';
import { normalizePhone } from '@/lib/utils';
import {
  ContactVerificationFormData,
  contactVerificationSchema,
} from '@/lib/validation';
import { toast } from '@/providers/toaster';
import { useUserStore } from '@/stores';
import { EUserMethod } from '@/types/user.type';
import { emptyLocalEmail } from '@/utils/helpers';

export default function SecurityScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { user } = useUserStore();

  const [faceId, setFaceId] = useState(false);
  const [appLock, setAppLock] = useState(false);

  const verificationForm = useForm<ContactVerificationFormData>({
    resolver: zodResolver(contactVerificationSchema),
    defaultValues: {
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      phoneOtp: '',
    },
  });

  const { mutateAsync: sendPhoneOtp, isPending: isSendingPhoneOtp } =
    useSendPhoneOtp();
  const { mutateAsync: verifyPhoneOtp, isPending: isVerifyingPhoneOtp } =
    useVerifyPhoneOtp();

  const {
    mutateAsync: sendEmailVerification,
    isPending: isSendingEmailVerify,
  } = useSendEmailVerify();

  const phoneTimer = useTimer();
  const emailTimer = useTimer();

  const watched = useWatch({
    control: verificationForm.control,
    name: ['email', 'phone', 'phoneOtp'],
  });

  const [emailValue, phoneValue, phoneOtp] = watched.map(
    (v) => v ?? '',
  ) as string[];
  const normalized = useMemo(
    () => ({
      currentEmail: emptyLocalEmail(emailValue),
      currentPhone: normalizePhone(phoneValue) || '',
      userEmail: emptyLocalEmail(user?.email ?? ''),
      userPhone: normalizePhone(user?.phone ?? '') || '',
    }),
    [emailValue, phoneValue, user],
  );

  // ───────────────── Email Verify ────────────────── //
  const handleSendEmailVerification = useCallback(async () => {
    if (!normalized.currentEmail) {
      toast.error({ title: 'Enter email address' });
      return;
    }
    const res = await sendEmailVerification({ email: normalized.currentEmail });
    console.log(`STRINGIFIED 👉:`, JSON.stringify(res, null, 2));

    toast.success({ title: 'Verification code sent' });

    emailTimer.start(60);
  }, [normalized.currentEmail, sendEmailVerification, emailTimer]);

  const handleSendPhoneOtp = useCallback(async () => {
    if (!normalized.currentPhone) {
      toast.error({ title: 'Enter phone number' });
      return;
    }
    await sendPhoneOtp({ phoneNumber: normalized.currentPhone });
    phoneTimer.start(60);
  }, [normalized.currentPhone, sendPhoneOtp, phoneTimer]);

  const handleVerifyPhone = useCallback(async () => {
    if (!phoneOtp) return;
    await verifyPhoneOtp({
      phoneNumber: normalized.currentPhone,
      code: phoneOtp,
      disableSession: false,
      updatePhoneNumber: true,
    });
    toast.success({ title: 'Verified' });
  }, [normalized.currentPhone, phoneOtp, verifyPhoneOtp]);

  const emailIsVerified = useMemo(() => {
    return Boolean(user?.emailVerified && normalized.currentEmail);
  }, [normalized, user]);

  const phoneIsVerified = useMemo(() => {
    return Boolean(user?.phoneNumberVerified && normalized.currentPhone);
  }, [normalized, user]);

  return (
    <KeyboardAvoid
      className="bg-background"
      contentContainerStyle={{
        paddingTop: 8,
        paddingBottom: insets.bottom + 24,
      }}
    >
      <Header
        title={t('settings.pages.security.title')}
        subtitle={t('settings.pages.security.description')}
        className="mb-6 px-4"
      />

      {/* ACCESS CONTROLS */}
      <Text className="mx-4 mb-2 text-xs font-medium text-muted-foreground uppercase">
        Access Controls
      </Text>

      <View className="mx-4 rounded-xl bg-muted/40 overflow-hidden">
        <View className="flex-row items-center justify-between px-4 h-14">
          <Text className="text-base text-foreground">Face ID</Text>
          <Switch value={faceId} onValueChange={setFaceId} />
        </View>
        <View className="h-px bg-border/40 ml-4" />
        <View className="flex-row items-center justify-between px-4 h-14">
          <Text className="text-base text-foreground">App Lock</Text>
          <Switch value={appLock} onValueChange={setAppLock} />
        </View>
      </View>

      {/* CONTACT VERIFICATION */}
      <Text className="mx-4 mt-6 mb-2 text-xs font-medium text-muted-foreground uppercase">
        Contact Verification
      </Text>

      <View className="mx-4 rounded-xl bg-muted/40 overflow-hidden p-4 gap-4">
        <View>
          <Text className="text-sm text-muted-foreground mb-1">
            Email Address
          </Text>

          <View className="flex-row items-center gap-2 justify-between">
            <FormField
              control={verificationForm.control}
              name="email"
              className="flex-1"
              render={({ field }) => (
                <Input
                  {...field}
                  editable={user?.userMethod === EUserMethod.PHONE}
                  placeholder="you@example.com"
                />
              )}
            />
            {emailIsVerified ? (
              <Icons.CheckCircle2 className="text-green-500" size={24} />
            ) : (
              <Icons.ShieldAlert className="text-red-500" size={24} />
            )}
          </View>

          {!emailIsVerified && (
            <>
              {/* SEND CODE ROW */}
              {emailTimer.seconds > 0 ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 self-start"
                  onPress={handleSendEmailVerification}
                  disabled={isSendingEmailVerify || emailTimer.seconds > 0}
                  loading={isSendingEmailVerify}
                >
                  <Text>Resend in {emailTimer.formatted}</Text>
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 self-start"
                  onPress={handleSendEmailVerification}
                  disabled={isSendingEmailVerify}
                  loading={isSendingEmailVerify}
                >
                  <Text>Send verification link</Text>
                </Button>
              )}
            </>
          )}
        </View>

        <View>
          <Text className="text-sm text-muted-foreground mb-1">
            Phone Number
          </Text>
          <View className="flex-row items-center gap-2">
            <FormField
              control={verificationForm.control}
              name="phone"
              className="flex-1"
              render={({ field }) => <PhoneInput {...field} />}
            />
            {phoneIsVerified ? (
              <Icons.CheckCircle2 className="text-green-500" size={24} />
            ) : (
              <Icons.ShieldAlert className="text-red-500" size={24} />
            )}
          </View>
          {!phoneIsVerified && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 self-start"
                onPress={handleSendPhoneOtp}
                loading={isSendingPhoneOtp}
                disabled={isSendingPhoneOtp || phoneTimer.seconds > 0}
              >
                <Text>
                  {phoneTimer.seconds > 0
                    ? `Wait ${phoneTimer.formatted}`
                    : 'Send code'}
                </Text>
              </Button>

              {phoneTimer.hasStarted && (
                <View className="flex-row gap-2 mt-2">
                  <FormField
                    control={verificationForm.control}
                    name="phoneOtp"
                    className="flex-1"
                    render={({ field }) => (
                      <NumberInput
                        className="h-12 bg-muted/30 rounded-lg px-3"
                        placeholder="SMS Code"
                        value={String(field.value ?? '')}
                        onChangeText={field.onChangeText}
                      />
                    )}
                  />
                  <Button
                    size="sm"
                    className="h-12 px-4"
                    onPress={handleVerifyPhone}
                    disabled={isVerifyingPhoneOtp}
                    loading={isVerifyingPhoneOtp}
                  >
                    <Text>Confirm</Text>
                  </Button>
                </View>
              )}
            </>
          )}
        </View>
      </View>

      {/* PASSWORD */}
      <Text className="mx-4 mt-6 mb-2 text-xs font-medium text-muted-foreground uppercase">
        Password
      </Text>

      <View className="mx-4 rounded-xl bg-muted/40 overflow-hidden">
        <Pressable
          onPress={() => router.push('/(settings)/security/change-password')}
          className="flex-row items-center justify-between px-4 py-5"
        >
          <View>
            <Text className="text-base text-foreground">Change Password</Text>
            <Text className="text-xs text-muted-foreground">
              Last updated 3 months ago
            </Text>
          </View>
          <Icons.ChevronRight size={18} className="text-muted-foreground" />
        </Pressable>
      </View>
    </KeyboardAvoid>
  );
}
