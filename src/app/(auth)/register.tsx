import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import FormField from '@/components/shared/form-field';
import KeyboardAvoid from '@/components/shared/keyboard-avoid';
import {
  Button,
  Input,
  PasswordInput,
  PhoneInput,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from '@/components/ui';
import { useRegister } from '@/hooks/auth';
import { Feedback } from '@/lib/haptics';
import { normalizePhone } from '@/lib/utils';
import {
  AuthHeader,
  RegisterUserFormType,
  registerUserSchema,
} from '@/views/auth';

type RegisterMethod = 'email' | 'phone' | string;

export default function RegisterScreen() {
  const router = useRouter();
  const { t } = useTranslation();

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
    const payload = {
      method: data.method,
      identifier:
        data.method === 'email'
          ? data.identifier
          : normalizePhone(data.identifier),
      password: data.password,
      username: data.username,
    };
    await register(payload).then(() => {
      router.replace('/(auth)/success?type=register');
    });
  };

  const handleChangeTab = (tab: RegisterMethod) => {
    form.reset();
    setTab(tab);
    form.setValue('method', tab as 'email' | 'phone');
  };

  return (
    <KeyboardAvoid className="main-area">
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
                  onSubmitEditing={() => form.setFocus('identifier')}
                />
              )}
              required
            />
            <FormField
              control={form.control}
              name="identifier"
              label={t('auth.phone')}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  placeholder={t('auth.phonePlaceholder')}
                  returnKeyType="next"
                  onSubmitEditing={() => form.setFocus('password')}
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
                  onSubmitEditing={() => form.setFocus('confirmPassword')}
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
                  onSubmitEditing={form.handleSubmit(handleRegister)}
                />
              )}
              required
            />
          </TabsContent>
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
                  onSubmitEditing={() => form.setFocus('identifier')}
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
                  onSubmitEditing={() => form.setFocus('password')}
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
                  onSubmitEditing={() => form.setFocus('confirmPassword')}
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
                  onSubmitEditing={form.handleSubmit(handleRegister)}
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
          size="lg"
        >
          <Text>{t('auth.register.submit')}</Text>
        </Button>

        <View className="flex-row justify-center items-center mt-4 pb-20">
          <Text className="text-muted-foreground">
            {t('auth.register.alreadyHaveAccount')}
          </Text>
          <Button
            variant="link"
            onPress={() => {
              Feedback.soft();
              router.dismissTo('/(auth)/login');
            }}
          >
            <Text className="font-body">{t('auth.register.login')}</Text>
          </Button>
        </View>
      </View>
    </KeyboardAvoid>
  );
}
