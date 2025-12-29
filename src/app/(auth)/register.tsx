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
import { useRegister } from '@/hooks/auth';
import { Feedback } from '@/lib/haptics';

import {
  AuthHeader,
  RegisterUserFormType,
  registerUserSchema,
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
  const { mutateAsync: register, isPending: isRegisterPending } = useRegister();

  const form = useForm<RegisterUserFormType>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      method: 'phone',
      username: '',
      identifier: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleRegister = async (data: RegisterUserFormType) => {
    try {
      const payload = {
        method: data.method,
        identifier: data.identifier,
        password: data.password,
        username: data.username,
      };
      const response = await register(payload);
      console.log(response);
      router.replace('/(auth)/success?type=register');
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeTab = (tab: RegisterMethod) => {
    form.reset();
    setTab(tab);
    form.setValue('method', tab as 'email' | 'phone');
  };

  return (
    <KeyboardAvoid>
      <View className="main-area">
        <View className="pt-20">
          <AuthHeader
            title={t('auth.register.title')}
            subtitle={t('auth.register.subtitle')}
          />

          <Tabs
            value={tab}
            onValueChange={handleChangeTab}
            className="w-full mt-10"
          >
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
                control={form.control}
                name="username"
                label={t('auth.username')}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={t('auth.usernamePlaceholder')}
                    returnKeyType="next"
                  />
                )}
                required
              />
              <FormField
                control={form.control}
                name="identifier"
                label={t('auth.email')}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={t('auth.emailPlaceholder')}
                    returnKeyType="next"
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                )}
                required
              />
              <FormField
                control={form.control}
                name="password"
                label={t('auth.password')}
                render={({ field }) => (
                  <PasswordInput
                    {...field}
                    placeholder={t('auth.passwordPlaceholder')}
                    returnKeyType="next"
                  />
                )}
                required
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                label={t('auth.confirmPassword')}
                render={({ field }) => (
                  <PasswordInput
                    {...field}
                    placeholder={t('auth.confirmPasswordPlaceholder')}
                    returnKeyType="done"
                  />
                )}
                required
              />
            </TabsContent>
            <TabsContent value="phone" className="gap-y-6 mt-6">
              <FormField
                control={form.control}
                name="username"
                label={t('auth.username')}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={t('auth.usernamePlaceholder')}
                    returnKeyType="next"
                  />
                )}
                required
              />
              <FormField
                control={form.control}
                name="identifier"
                label={t('auth.phone')}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={t('auth.phonePlaceholder')}
                    returnKeyType="next"
                  />
                )}
                required
              />
              <FormField
                control={form.control}
                name="password"
                label={t('auth.password')}
                render={({ field }) => (
                  <PasswordInput
                    {...field}
                    placeholder={t('auth.passwordPlaceholder')}
                    returnKeyType="next"
                  />
                )}
                required
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                label={t('auth.confirmPassword')}
                render={({ field }) => (
                  <Input
                    {...field}
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
            onPress={form.handleSubmit(handleRegister)}
            disabled={isRegisterPending || form.formState.isSubmitting}
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
