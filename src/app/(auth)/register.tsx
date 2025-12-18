import FormField from '@/components/shared/form-field';
import KeyboardAvoid from '@/components/shared/keyboard-avoid';
import {
  Button,
  Input,
  PasswordInput,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from '@/components/ui';
import { Feedback } from '@/lib/haptics';

import {
  AuthHeader,
  RegisterEmailFormType,
  RegisterPhoneFormType,
  registerEmailSchema,
  registerPhoneSchema,
} from '@/views/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

type RegisterMethod = 'email' | 'phone' | string;

export default function RegisterScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [tab, setTab] = useState<RegisterMethod>('phone');

  const {
    control: emailControl,
    handleSubmit: handleEmailSubmit,
    formState: { isSubmitting: isEmailSubmitting },
  } = useForm<RegisterEmailFormType>({
    resolver: zodResolver(registerEmailSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const {
    control: phoneControl,
    handleSubmit: handlePhoneSubmit,
    formState: { isSubmitting: isPhoneSubmitting },
  } = useForm<RegisterPhoneFormType>({
    resolver: zodResolver(registerPhoneSchema),
    defaultValues: {
      username: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleRegisterWithEmail = async (data: RegisterEmailFormType) => {
    // TODO: Implement email registration logic
    router.replace('/(auth)/success?type=register');
  };

  const handleRegisterWithPhone = async (data: RegisterPhoneFormType) => {
    // TODO: Implement phone registration logic
    router.replace('/(auth)/success?type=register');
  };

  return (
    <KeyboardAvoid>
      <View className="main-area">
        <View className="pt-20">
          <AuthHeader
            title={t('auth.register.title')}
            subtitle={t('auth.register.subtitle')}
          />

          <Tabs value={tab} onValueChange={setTab} className="w-full mt-10">
            <TabsList>
              <TabsTrigger value="phone">
                <Text>{t('auth.register.phoneTab')}</Text>
              </TabsTrigger>
              <TabsTrigger value="email">
                <Text>{t('auth.register.emailTab')}</Text>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="email" className="gap-y-6 mt-6">
              <FormField
                control={emailControl}
                name="username"
                label={t('auth.username')}
                render={({ field }) => (
                  <Input
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={t('auth.usernamePlaceholder')}
                    returnKeyType="next"
                  />
                )}
                required
              />
              <FormField
                control={emailControl}
                name="email"
                label={t('auth.email')}
                render={({ field }) => (
                  <Input
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={t('auth.emailPlaceholder')}
                    returnKeyType="next"
                  />
                )}
                required
              />
              <FormField
                control={emailControl}
                name="password"
                label={t('auth.password')}
                render={({ field }) => (
                  <PasswordInput
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={t('auth.passwordPlaceholder')}
                    returnKeyType="next"
                  />
                )}
                required
              />
              <FormField
                control={emailControl}
                name="confirmPassword"
                label={t('auth.confirmPassword')}
                render={({ field }) => (
                  <Input
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={t('auth.confirmPasswordPlaceholder')}
                    returnKeyType="done"
                  />
                )}
                required
              />
            </TabsContent>
            <TabsContent value="phone" className="gap-y-6 mt-6">
              <FormField
                control={phoneControl}
                name="username"
                label={t('auth.username')}
                render={({ field }) => (
                  <Input
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={t('auth.usernamePlaceholder')}
                    returnKeyType="next"
                  />
                )}
                required
              />
              <FormField
                control={phoneControl}
                name="phone"
                label={t('auth.phone')}
                render={({ field }) => (
                  <Input
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={t('auth.phonePlaceholder')}
                    returnKeyType="next"
                  />
                )}
                required
              />
              <FormField
                control={phoneControl}
                name="password"
                label={t('auth.password')}
                render={({ field }) => (
                  <PasswordInput
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={t('auth.passwordPlaceholder')}
                    returnKeyType="next"
                  />
                )}
                required
              />
              <FormField
                control={phoneControl}
                name="confirmPassword"
                label={t('auth.confirmPassword')}
                render={({ field }) => (
                  <Input
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={t('auth.confirmPasswordPlaceholder')}
                    returnKeyType="done"
                  />
                )}
                required
              />
            </TabsContent>
          </Tabs>
        </View>

        <View className="mt-10">
          <Button
            onPress={
              tab === 'email'
                ? handleEmailSubmit(handleRegisterWithEmail)
                : handlePhoneSubmit(handleRegisterWithPhone)
            }
            disabled={tab === 'email' ? isEmailSubmitting : isPhoneSubmitting}
          >
            <Text>{t('auth.register.submit')}</Text>
          </Button>

          <View className="flex-row justify-center items-center mt-4 pb-20">
            <Text className="text-sm text-muted-foreground">
              {t('auth.register.alreadyHaveAccount')}
            </Text>
            <Button
              variant="link"
              onPress={() => {
                Feedback.soft();
                router.dismissTo('/(auth)/login');
              }}
            >
              <Text className="text-primary">{t('auth.register.login')}</Text>
            </Button>
          </View>
        </View>
      </View>
    </KeyboardAvoid>
  );
}
