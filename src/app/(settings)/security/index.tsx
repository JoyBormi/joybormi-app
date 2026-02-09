import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
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
  contactVerificationSchema,
} from '@/lib/validation';
import { toast } from '@/providers/toaster';
import { useUserStore } from '@/stores';
import { emptyLocalEmail } from '@/utils/helpers';

export default function SecurityScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { user } = useUserStore();

  const [faceId, setFaceId] = useState(false);
  const [appLock, setAppLock] = useState(false);

  const form = useForm<ContactVerificationFormData>({
    resolver: zodResolver(contactVerificationSchema),
    defaultValues: {
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      phoneOtp: '',
    },
  });

  const watched = useWatch({
    control: form.control,
    name: ['email', 'phone', 'phoneOtp'],
  });

  const [emailValue, phoneValue, phoneOtp] = watched.map((v) => v ?? '');

  const normalized = useMemo(
    () => ({
      currentEmail: emptyLocalEmail(emailValue),
      currentPhone: normalizePhone(phoneValue) || '',
      userEmail: emptyLocalEmail(user?.email ?? ''),
      userPhone: normalizePhone(user?.phone ?? '') || '',
    }),
    [emailValue, phoneValue, user],
  );

  /* ───────── EMAIL STATE ───────── */

  const emailHasChanged =
    !!normalized.currentEmail &&
    normalized.currentEmail !== normalized.userEmail;

  const emailIsVerified = user?.emailVerified === true && !emailHasChanged;

  /* ───────── HOOKS ───────── */

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

  /* ───────── EMAIL ACTIONS ───────── */

  const handleChangeEmail = useCallback(async () => {
    if (!normalized.currentEmail) {
      toast.error({ title: 'Enter a valid email address' });
      return;
    }

    await changeEmail({
      newEmail: normalized.currentEmail,
      callbackURL: 'joy-bormi-app://verify-email',
    });
    toast.success({
      title: 'Email change started',
      description:
        'Approve the link sent to your current email, then verify the new email to finish.',
    });
  }, [normalized.currentEmail, changeEmail]);

  const handleSendEmailVerification = useCallback(async () => {
    await sendEmailVerify({ email: normalized.currentEmail });
    toast.info({
      title: 'Verification email sent',
      description: 'Check your inbox or spam folder.',
    });
    emailTimer.start(60);
  }, [sendEmailVerify, normalized.currentEmail, emailTimer]);

  /* ───────── PHONE ACTIONS ───────── */

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
    toast.success({ title: 'Phone verified' });
  }, [normalized.currentPhone, phoneOtp, verifyPhoneOtp]);

  return (
    <KeyboardAvoid
      className="main-area"
      contentContainerStyle={{
        paddingTop: 8,
        paddingBottom: insets.bottom + 24,
        rowGap: 16,
      }}
    >
      <Header
        title={t('settings.pages.security.title')}
        subtitle={t('settings.pages.security.description')}
        className="mb-4"
      />

      {/* ACCESS CONTROLS — unchanged */}

      {/* CONTACT VERIFICATION */}
      {/* EMAIL */}
      <View>
        <Text className="text-sm text-muted-foreground mb-1">
          Email Address
        </Text>

        <View className="flex-row items-center gap-2">
          <FormField
            control={form.control}
            name="email"
            className="flex-1"
            render={({ field }) => (
              <Input
                {...field}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="you@example.com"
              />
            )}
          />

          {emailIsVerified ? (
            <Icons.CheckCircle2 className="text-success" size={22} />
          ) : (
            <Icons.ShieldAlert className="text-warning" size={22} />
          )}
        </View>

        {emailHasChanged && (
          <Button
            size="sm"
            className="mt-2 self-start"
            onPress={handleChangeEmail}
            loading={isChangingEmail}
          >
            <Text>Save email</Text>
          </Button>
        )}

        {!emailIsVerified && !emailHasChanged && (
          <>
            <Text className="mt-2 text-xs text-muted-foreground">
              You must verify this email. Use an email you can access.
            </Text>

            <Button
              size="sm"
              variant="outline"
              className="mt-2 self-start"
              onPress={handleSendEmailVerification}
              disabled={emailTimer.seconds > 0}
              loading={isSendingEmailVerify}
            >
              <Text>
                {emailTimer.seconds > 0
                  ? `Resend in ${emailTimer.formatted}`
                  : 'Send verification email'}
              </Text>
            </Button>
          </>
        )}
      </View>

      {/* PHONE — FULLY PRESERVED */}
      <View>
        <Text className="text-sm text-muted-foreground mb-1">Phone Number</Text>

        <View className="flex-row items-center gap-2">
          <FormField
            control={form.control}
            name="phone"
            className="flex-1"
            render={({ field }) => <PhoneInput {...field} />}
          />

          {user?.phoneNumberVerified ? (
            <Icons.CheckCircle2 className="text-success" size={22} />
          ) : (
            <Icons.ShieldAlert className="text-warning" size={22} />
          )}
        </View>

        {!user?.phoneNumberVerified && (
          <>
            <Button
              size="sm"
              variant="outline"
              className="mt-2 self-start"
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

            {phoneTimer.hasStarted && (
              <View className="flex-row gap-2 mt-2">
                <FormField
                  control={form.control}
                  name="phoneOtp"
                  className="flex-1"
                  render={({ field }) => (
                    <NumberInput
                      className="h-12 bg-muted/30 rounded-lg px-3"
                      placeholder="SMS Code"
                      {...field}
                    />
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

      {/* PASSWORD */}
      <Text className=" mt-6 text-xs font-medium text-muted-foreground uppercase">
        Password
      </Text>

      <View className="rounded-xl bg-muted/40 overflow-hidden">
        <Pressable
          onPress={() => router.push(routes.settings.security.change_password)}
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
