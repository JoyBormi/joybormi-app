import { FormField, FormFieldType } from '@/components/shared/fields';
import KeyboardAvoid from '@/components/shared/keyboard-avoid';
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from '@/components/ui';
import {
  AuthHeader,
  ForgotPwdEmailFormType,
  ForgotPwdPhoneFormType,
  forgotPwdCodeSchema,
  forgotPwdEmailSchema,
  forgotPwdPhoneCodeSchema,
  forgotPwdPhoneSchema,
} from '@/views/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

interface ForgotPwdState {
  tab: 'email' | 'phone';
  emailCodeSent: boolean;
  phoneCodeSent: boolean;
  isResending: boolean;
}

export default function ForgotPwdScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [state, setState] = useState<ForgotPwdState>({
    tab: 'phone',
    emailCodeSent: false,
    phoneCodeSent: false,
    isResending: false,
  });

  const emailForm = useForm<ForgotPwdEmailFormType>({
    resolver: zodResolver(
      state.emailCodeSent ? forgotPwdCodeSchema : forgotPwdEmailSchema,
    ),
    defaultValues: {
      email: '',
      code: '',
    },
  });

  const phoneForm = useForm<ForgotPwdPhoneFormType>({
    resolver: zodResolver(
      state.phoneCodeSent ? forgotPwdPhoneCodeSchema : forgotPwdPhoneSchema,
    ),
    defaultValues: {
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

  const handleSendCode = async (
    data: ForgotPwdEmailFormType | ForgotPwdPhoneFormType,
  ) => {
    // TODO: Implement send code logic based on tab type
    setState((prev) => ({
      ...prev,
      [state.tab === 'email' ? 'emailCodeSent' : 'phoneCodeSent']: true,
    }));
  };

  const handleResendCode = async () => {
    setState((prev) => ({ ...prev, isResending: true }));
    // TODO: Implement resend code logic based on tab type
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    setState((prev) => ({ ...prev, isResending: false }));
  };

  const handleVerifyCode = async (
    data: ForgotPwdEmailFormType | ForgotPwdPhoneFormType,
  ) => {
    // TODO: Implement verify code logic based on tab type
    router.replace('/(auth)/reset-pwd');
  };

  const handleTabChange = (value: string) => {
    setState((prev) => ({ ...prev, tab: value as 'email' | 'phone' }));
  };

  return (
    <KeyboardAvoid>
      <View className="main-area">
        <View className="pt-20">
          <AuthHeader
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
                placeholder={t('auth.emailPlaceholder')}
                fieldType={FormFieldType.INPUT}
                keyboard="email-address"
                returnKeyType="done"
                capitalize="none"
                required
                disabled={state.emailCodeSent}
              />
              {state.emailCodeSent && (
                <FormField
                  control={emailForm.control}
                  name="code"
                  label={t('auth.verificationCode')}
                  placeholder={t('auth.codePlaceholder')}
                  fieldType={FormFieldType.INPUT}
                  keyboard="number-pad"
                  returnKeyType="done"
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
                placeholder={t('auth.phonePlaceholder')}
                fieldType={FormFieldType.INPUT}
                keyboard="phone-pad"
                returnKeyType="done"
                required
                disabled={state.phoneCodeSent}
              />
              {state.phoneCodeSent && (
                <FormField
                  control={phoneForm.control}
                  name="code"
                  label={t('auth.verificationCode')}
                  placeholder={t('auth.codePlaceholder')}
                  fieldType={FormFieldType.INPUT}
                  keyboard="number-pad"
                  returnKeyType="done"
                  className="mt-6"
                  required
                />
              )}
            </TabsContent>
          </Tabs>
        </View>

        {!isCodeSent ? (
          <Button
            className="my-10"
            onPress={activeForm.handleSubmit(handleSendCode)}
          >
            <Text>{t('auth.forgotPwd.sendCode')}</Text>
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              className="mt-5"
              onPress={handleResendCode}
              disabled={state.isResending || isCodeValid}
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
              disabled={!isCodeValid}
            >
              <Text>{t('auth.forgotPwd.verify')}</Text>
            </Button>
          </>
        )}

        <View className="justify-center items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="font-primary underline text-sm">
              {t('auth.forgotPwd.backToLogin')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoid>
  );
}
