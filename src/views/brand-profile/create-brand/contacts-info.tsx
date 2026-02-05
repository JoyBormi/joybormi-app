import { useCallback, useMemo } from 'react';
import {
  Control,
  FieldValues,
  Path,
  UseFormSetFocus,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import Icons from '@/components/icons';
import FormField from '@/components/shared/form-field';
import { Button, Input, NumberInput, PhoneInput, Text } from '@/components/ui';
import { useSendPhoneOtp, useVerifyPhoneOtp } from '@/hooks/auth';
import { useOtpVerification } from '@/hooks/common';
import { useTimer } from '@/hooks/common/use-timer';
import { toast } from '@/providers/toaster';
import { useUserStore } from '@/stores';
import { emptyLocalEmail, normalizeInput } from '@/utils/helpers';

interface ContactsInfoProps<T extends FieldValues> {
  control: Control<T>;
  setFocus: UseFormSetFocus<T>;
  setValue: UseFormSetValue<T>;
}

export function ContactsInfo<T extends FieldValues>({
  control,
  setFocus,
  setValue,
}: ContactsInfoProps<T>) {
  const { user } = useUserStore();
  const { t } = useTranslation();

  const phoneTimer = useTimer();

  const { mutateAsync: sendPhoneOtp, isPending: isSendingPhoneOtp } =
    useSendPhoneOtp();
  const { mutateAsync: verifyPhoneOtp, isPending: isVerifyingPhoneOtp } =
    useVerifyPhoneOtp();

  const watched = useWatch({
    control,
    name: ['phone', 'phoneOtp'] as [Path<T>, Path<T>],
  });

  const [phoneValue, phoneOtpValue] = watched.map((value) => value ?? '') as [
    string,
    string,
  ];

  // Normalize and compare values
  const normalized = useMemo(() => {
    const currentPhone = normalizeInput(phoneValue) || '';
    const userPhone = normalizeInput(user?.phone ?? '') || '';

    return {
      currentPhone,
      userPhone,
    };
  }, [phoneValue, user?.phone]);

  const phoneVerification = useOtpVerification<T>({
    currentValue: normalized.currentPhone,
    originalValue: normalized.userPhone,
    otpValue: phoneOtpValue,
    otpFieldName: 'phoneOtp' as Path<T>,
    setValue,
    timer: phoneTimer,
  });

  const needsPhoneVerification = phoneVerification.needsVerification;
  const isPhoneVerified = phoneVerification.isVerified;

  const handleSendPhoneOtp = useCallback(async () => {
    if (!normalized.currentPhone) {
      toast.error({ title: 'Enter a valid phone number first.' });
      return;
    }
    await sendPhoneOtp({ phoneNumber: normalized.currentPhone });
    phoneTimer.start(60);
    toast.success({ title: 'Verification code sent.' });
  }, [normalized.currentPhone, sendPhoneOtp, phoneTimer]);

  const handleVerifyPhone = useCallback(async () => {
    if (!normalized.currentPhone || !phoneOtpValue) return;
    await verifyPhoneOtp({
      phoneNumber: normalized.currentPhone,
      code: phoneOtpValue,
      disableSession: false,
      updatePhoneNumber: true,
    });
    phoneVerification.markVerified();
    toast.success({ title: 'Phone verified.' });
  }, [
    normalized.currentPhone,
    phoneOtpValue,
    phoneVerification,
    verifyPhoneOtp,
  ]);

  return (
    <View className="gap-6 flex-1">
      {/* Header */}
      <View className="bg-card p-6 rounded-2xl border border-border">
        <View className="flex-row items-center gap-3 mb-2">
          <View className="w-12 h-12 rounded-xl bg-primary/20 items-center justify-center">
            <Icons.User className="text-primary" size={22} />
          </View>
          <Text className="text-xl font-bold text-foreground">
            Contact Information
          </Text>
        </View>
        <Text className="text-sm text-muted-foreground leading-5">
          Provide business contact details and owner information
        </Text>
      </View>

      {/* Form Fields */}
      <View className="gap-5 flex-1">
        {/* Business Contact Section */}
        <View className="gap-1 mb-2">
          <Text className="text-base font-semibold text-foreground">
            Business Contact
          </Text>
          <Text className="text-sm text-muted-foreground">
            How customers can reach your business
          </Text>
        </View>

        <FormField
          control={control}
          name="email"
          label="Business Email (Optional)"
          message="This will be used for account verification and customer inquiries"
          render={({ field }) => (
            <Input
              value={emptyLocalEmail(field.value ?? '')}
              onChangeText={field.onChangeText}
              placeholder={t('settings.profile.emailPlaceholder')}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => setFocus('phone' as Path<T>)}
            />
          )}
        />

        <FormField
          control={control}
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
                onSubmitEditing={() => setFocus('country' as Path<T>)}
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
              control={control}
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
                    disabled={!phoneOtpValue || isVerifyingPhoneOtp}
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

        {/* Divider */}
        <View className="h-px bg-border my-2" />

        {/* Owner Information Section */}
        <View className="gap-1 mb-2">
          <Text className="text-base font-semibold text-foreground">
            Owner Information
          </Text>
          <Text className="text-sm text-muted-foreground">
            Primary contact person for the business
          </Text>
        </View>

        <FormField
          control={control}
          name="ownerFirstName"
          label="First Name"
          required
          render={({ field }) => (
            <Input
              placeholder="John"
              {...field}
              returnKeyType="next"
              onSubmitEditing={() => setFocus('ownerLastName' as Path<T>)}
            />
          )}
        />

        <FormField
          control={control}
          name="ownerLastName"
          label="Last Name"
          required
          render={({ field }) => (
            <Input placeholder="Doe" {...field} returnKeyType="done" />
          )}
        />

        <View className="bg-primary/10 p-5 rounded-xl border border-primary/30">
          <View className="flex-row items-start gap-3">
            <Icons.Info className="text-primary mt-0.5" size={22} />
            <View className="flex-1">
              <Text className="text-base font-semibold text-foreground mb-2">
                Why do we need this?
              </Text>
              <Text className="text-sm text-muted-foreground leading-5">
                Owner information is required for account verification and legal
                compliance. This information will be kept private and secure.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
