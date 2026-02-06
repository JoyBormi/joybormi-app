import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import FormField from '@/components/shared/form-field';
import { Header } from '@/components/shared/header';
import KeyboardAvoid from '@/components/shared/keyboard-avoid';
import {
  Button,
  Input,
  OtpInput,
  PhoneInput,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from '@/components/ui';
import { routes } from '@/constants/routes';
import { useForgotPassword, useVerifyResetCode } from '@/hooks/auth';
import { Feedback } from '@/lib/haptics';
import { normalizePhone } from '@/lib/utils';
import { ForgotPasswordFormType, forgotPasswordSchema } from '@/lib/validation';

interface ForgotPwdState {
  tab: 'email' | 'phone';
  emailCodeSent: boolean;
  phoneCodeSent: boolean;
  isResending: boolean;
  resetToken: string | null;
}

export default function ForgotPwdScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [state, setState] = useState<ForgotPwdState>({
    tab: 'phone',
    emailCodeSent: false,
    phoneCodeSent: false,
    isResending: false,
    resetToken: null,
  });

  const { mutate: sendCode, isPending: isSending } = useForgotPassword();
  const { mutate: verifyCode, isPending: isVerifying } = useVerifyResetCode();

  const emailForm = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      method: 'email',
      email: '',
      code: '',
    },
  });

  const phoneForm = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      method: 'phone',
      phone: '',
      code: '',
    },
  });

  const activeForm = state.tab === 'email' ? emailForm : phoneForm;
  const isCodeSent =
    state.tab === 'email' ? state.emailCodeSent : state.phoneCodeSent;
  const code =
    state.tab === 'email' ? emailForm.watch('code') : phoneForm.watch('code');
  const isCodeValid = code?.length === 6;

  const handleSendCode = async (data: ForgotPasswordFormType) => {
    const identifier =
      state.tab === 'email' ? data.email : normalizePhone(data.phone ?? '');
    if (!identifier) return;

    sendCode(
      {
        method: state.tab,
        identifier,
      },
      {
        onSuccess: () => {
          setState((prev) => ({
            ...prev,
            [state.tab === 'email' ? 'emailCodeSent' : 'phoneCodeSent']: true,
          }));
        },
      },
    );
  };

  const handleResendCode = async () => {
    const data =
      state.tab === 'email' ? emailForm.getValues() : phoneForm.getValues();
    const identifier =
      state.tab === 'email' ? data.email : normalizePhone(data.phone ?? '');
    if (!identifier) return;

    setState((prev) => ({ ...prev, isResending: true }));
    sendCode(
      {
        method: state.tab,
        identifier,
      },
      {
        onSuccess: () => {
          setState((prev) => ({ ...prev, isResending: false }));
        },
        onError: () => {
          setState((prev) => ({ ...prev, isResending: false }));
        },
      },
    );
  };

  const handleVerifyCode = async (data: ForgotPasswordFormType) => {
    const identifier =
      state.tab === 'email' ? data.email : normalizePhone(data.phone ?? '');
    const code = data.code;
    if (!identifier || !code) return;

    verifyCode(
      {
        method: state.tab,
        identifier,
        code,
      },
      {
        onSuccess: (response) => {
          // Store reset token and navigate to reset password screen
          setState((prev) => ({ ...prev, resetToken: response.resetToken }));
          router.push({
            pathname: routes.auth.reset_password,
            params: { resetToken: response.resetToken },
          });
        },
      },
    );
  };

  const handleTabChange = (value: string) => {
    setState((prev) => ({ ...prev, tab: value as 'email' | 'phone' }));
    if (value === 'email') {
      emailForm.setValue('method', 'email');
    } else {
      phoneForm.setValue('method', 'phone');
    }
  };

  return (
    <KeyboardAvoid className="main-area">
      <Header
        title={t('auth.forgotPwd.title')}
        subtitle={t('auth.forgotPwd.subtitle')}
      />
      <Tabs
        value={state.tab}
        onValueChange={handleTabChange}
        className="w-full gap-y-6 mt-10"
      >
        <TabsList>
          <TabsTrigger value="phone">
            <Text>{t('auth.register.phoneTab')}</Text>
          </TabsTrigger>
          <TabsTrigger value="email">
            <Text>{t('auth.register.emailTab')}</Text>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="email">
          <FormField
            control={emailForm.control}
            name="email"
            label={t('auth.email')}
            render={({ field }) => (
              <Input
                placeholder={t('auth.emailPlaceholder')}
                returnKeyType="done"
                disabled={state.emailCodeSent}
                {...field}
              />
            )}
            required
          />
          {state.emailCodeSent && (
            <FormField
              control={emailForm.control}
              name="code"
              label={t('auth.verificationCode')}
              render={({ field }) => (
                <OtpInput length={6} {...field} disabled={isVerifying} />
              )}
              className="mt-6"
              required
            />
          )}
        </TabsContent>
        <TabsContent value="phone">
          <FormField
            control={phoneForm.control}
            name="phone"
            label={t('auth.phone')}
            render={({ field }) => (
              <PhoneInput
                placeholder={t('auth.phonePlaceholder')}
                returnKeyType="done"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                defaultCountry="UZ"
              />
            )}
            required
          />
          {state.phoneCodeSent && (
            <FormField
              control={phoneForm.control}
              name="code"
              label={t('auth.verificationCode')}
              render={({ field }) => (
                <OtpInput
                  length={6}
                  value={field.value}
                  onChangeText={field.onChange}
                  disabled={isVerifying}
                />
              )}
              className="mt-6"
              required
            />
          )}
        </TabsContent>
      </Tabs>

      {!isCodeSent ? (
        <Button
          className="my-10"
          onPress={activeForm.handleSubmit(handleSendCode)}
          disabled={isSending}
        >
          <Text>
            {isSending
              ? t('common.buttons.loading')
              : t('auth.forgotPwd.sendCode')}
          </Text>
        </Button>
      ) : (
        <>
          <Button
            variant="outline"
            className="mt-5"
            onPress={handleResendCode}
            disabled={state.isResending || isCodeValid || isSending}
          >
            <Text>
              {state.isResending
                ? t('auth.forgotPwd.resending')
                : t('auth.forgotPwd.resend')}
            </Text>
          </Button>
          <Button
            className="my-5"
            onPress={activeForm.handleSubmit(handleVerifyCode)}
            disabled={!isCodeValid || isVerifying}
          >
            <Text>
              {isVerifying
                ? t('common.buttons.loading')
                : t('auth.forgotPwd.verify')}
            </Text>
          </Button>
        </>
      )}

      <View className="justify-center items-center">
        <Pressable
          onPress={() => {
            Feedback.soft();
            router.back();
          }}
        >
          <Text className="font-subbody underline">
            {t('auth.forgotPwd.backToLogin')}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoid>
  );
}
