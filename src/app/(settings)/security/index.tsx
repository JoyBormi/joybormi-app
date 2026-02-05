import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icons from '@/components/icons';
import { KeyboardAvoid } from '@/components/shared';
import { Header } from '@/components/shared/header';
import { Button, Input, NumberInput, PhoneInput, Text } from '@/components/ui';
import {
  useSendPhoneOtp,
  useVerifyEmail,
  useVerifyPhoneOtp,
} from '@/hooks/auth';
import { useOtpVerification } from '@/hooks/common';
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

  // Local state for toggles
  const [faceId, setFaceId] = useState(false);
  const [appLock, setAppLock] = useState(false);

  const verificationForm = useForm<ContactVerificationFormData>({
    resolver: zodResolver(contactVerificationSchema),
    defaultValues: {
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      emailOtp: '',
      phoneOtp: '',
    },
  });

  const { mutateAsync: sendPhoneOtp, isPending: isSendingPhoneOtp } =
    useSendPhoneOtp();
  const { mutateAsync: verifyPhoneOtp, isPending: isVerifyingPhoneOtp } =
    useVerifyPhoneOtp();
  const { mutateAsync: verifyEmail, isPending: isVerifyingEmail } =
    useVerifyEmail();

  const phoneTimer = useTimer();
  const emailTimer = useTimer();

  const watched = useWatch({
    control: verificationForm.control,
    name: ['email', 'phone', 'emailOtp', 'phoneOtp'],
  });

  const [emailValue, phoneValue, emailOtp, phoneOtp] = watched.map(
    (v) => v ?? '',
  ) as [string, string, string, string];

  const normalized = useMemo(
    () => ({
      currentEmail: emptyLocalEmail(emailValue),
      currentPhone: normalizePhone(phoneValue) || '',
      userEmail: emptyLocalEmail(user?.email ?? ''),
      userPhone: normalizePhone(user?.phone ?? '') || '',
    }),
    [emailValue, phoneValue, user],
  );

  const emailVerification = useOtpVerification<ContactVerificationFormData>({
    currentValue: normalized.currentEmail,
    originalValue: normalized.userEmail,
    otpValue: emailOtp,
    otpFieldName: 'emailOtp',
    setValue: verificationForm.setValue,
    timer: emailTimer,
  });

  const phoneVerification = useOtpVerification<ContactVerificationFormData>({
    currentValue: normalized.currentPhone,
    originalValue: normalized.userPhone,
    otpValue: phoneOtp,
    otpFieldName: 'phoneOtp',
    setValue: verificationForm.setValue,
    timer: phoneTimer,
  });

  const handleSendPhoneOtp = useCallback(async () => {
    if (!normalized.currentPhone) return toast.error({ title: 'Enter phone' });
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
    phoneVerification.markVerified();
    toast.success({ title: 'Verified' });
  }, [normalized.currentPhone, phoneOtp, phoneVerification, verifyPhoneOtp]);

  return (
    <KeyboardAvoid
      className="bg-background px-4"
      scrollConfig={{
        contentContainerStyle: {
          paddingBottom: insets.bottom + 40,
          paddingTop: 12,
        },
      }}
    >
      <Header
        title={t('settings.pages.security.title')}
        subtitle={t('settings.pages.security.description')}
        className="mb-4"
      />

      {/* --- ACCESS SECTION --- */}
      <Text className="font-caption text-xs text-muted-foreground uppercase tracking-tighter mb-2 ml-1">
        Access
      </Text>
      <View className="bg-card border border-border rounded-xl px-4 mb-6">
        <View className="flex-row items-center justify-between py-3 border-b border-border/50">
          <Text className="text-sm font-medium text-foreground">Face ID</Text>
          <Switch value={faceId} onValueChange={setFaceId} />
        </View>
        <View className="flex-row items-center justify-between py-3">
          <Text className="text-sm font-medium text-foreground">
            Lock Screen
          </Text>
          <Switch value={appLock} onValueChange={setAppLock} />
        </View>
      </View>

      {/* --- CONTACTS SECTION --- */}
      <Text className="font-caption text-xs text-muted-foreground uppercase tracking-tighter mb-2 ml-1">
        Verification
      </Text>
      <View className="gap-y-3 mb-6">
        {/* Email */}
        <View className="bg-card border border-border rounded-xl p-3">
          <View className="flex-row items-center gap-3">
            <View className="flex-1">
              <Text className="text-[10px] text-muted-foreground font-medium uppercase mb-1">
                Email
              </Text>
              <Input
                value={normalized.currentEmail}
                onChangeText={(v) => verificationForm.setValue('email', v)}
                className="h-7 p-0 bg-transparent border-0 text-sm"
                editable={user?.userMethod === EUserMethod.PHONE}
              />
            </View>
            {emailVerification.isVerified ? (
              <Icons.CheckCircle size={18} className="text-success" />
            ) : (
              <Button
                size="sm"
                variant="secondary"
                className="h-8 px-4 rounded-lg"
                onPress={() => {}}
              >
                <Text className="text-xs">Verify</Text>
              </Button>
            )}
          </View>
        </View>

        {/* Phone */}
        <View className="bg-card border border-border rounded-xl p-3">
          <View className="flex-row items-center gap-3">
            <View className="flex-1">
              <Text className="text-[10px] text-muted-foreground font-medium uppercase mb-1">
                Phone
              </Text>
              <PhoneInput
                value={verificationForm.getValues('phone')}
                onChangeText={(v) => verificationForm.setValue('phone', v)}
                className="h-7 p-0 bg-transparent border-0 text-sm"
              />
            </View>
            {phoneVerification.isVerified ? (
              <Icons.CheckCircle size={18} className="text-success" />
            ) : (
              <Button
                size="sm"
                variant="secondary"
                className="h-8 px-4 rounded-lg"
                onPress={handleSendPhoneOtp}
                disabled={isSendingPhoneOtp || phoneTimer.seconds > 0}
              >
                {isSendingPhoneOtp ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <Text className="text-xs">
                    {phoneTimer.seconds > 0 ? phoneTimer.formatted : 'Verify'}
                  </Text>
                )}
              </Button>
            )}
          </View>

          {phoneTimer.hasStarted && !phoneVerification.isVerified && (
            <View className="mt-3 pt-3 border-t border-border/50 flex-row gap-2">
              <NumberInput
                placeholder="OTP Code"
                className="flex-1 h-10 bg-muted/50 rounded-lg px-3 text-sm"
                onChangeText={(v) => verificationForm.setValue('phoneOtp', v)}
              />
              <Button
                size="sm"
                className="h-10 px-4"
                onPress={handleVerifyPhone}
                disabled={isVerifyingPhoneOtp}
              >
                {isVerifyingPhoneOtp ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text>Confirm</Text>
                )}
              </Button>
            </View>
          )}
        </View>
      </View>

      {/* --- PASSWORD SECTION --- */}
      <Text className="font-caption text-xs text-muted-foreground uppercase tracking-tighter mb-2 ml-1">
        Password
      </Text>
      <View className="bg-card border border-border rounded-xl p-4 flex-row items-center justify-between">
        <View>
          <Text className="text-sm font-medium">Account Password</Text>
          <Text className="text-xs text-muted-foreground">
            Last changed 3 months ago
          </Text>
        </View>
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg px-4 border-border"
          onPress={() => router.push('/(settings)/security/change-password')}
        >
          <Text className="text-xs">Update</Text>
        </Button>
      </View>
    </KeyboardAvoid>
  );
}
