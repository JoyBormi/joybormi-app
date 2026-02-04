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
  PasswordInput,
  PhoneInput,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from '@/components/ui';
import { routes } from '@/constants/routes';
import { useLogin } from '@/hooks/auth/use-login';
import { Feedback } from '@/lib/haptics';
import { normalizePhone } from '@/lib/utils';
import { LoginFormType, loginSchema } from '@/views/auth';

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [tab, setTab] = useState('phone');
  const { control, reset, handleSubmit, setValue, clearErrors, setFocus } =
    useForm<LoginFormType>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
        method: 'phone',
        email: '',
        phone: '',
        password: '',
      },
    });

  const { mutate: login, isPending } = useLogin();
  const onSubmit = (data: LoginFormType) => {
    // Map form data to API format
    const identifier =
      data.method === 'email' ? data.email : normalizePhone(data.phone ?? '');

    // Ensure identifier is not empty
    if (!identifier) {
      console.error('[Login] Missing identifier');
      return;
    }

    const credentials = {
      method: data.method,
      identifier,
      password: data.password,
    };
    login(credentials, {
      onSuccess: () => {
        // Navigate to home after successful login
        router.replace(routes.tabs.home);
      },
    });
  };

  const handleTab = (tab: string) => {
    setTab(tab);
    clearErrors();
    reset();
    setValue('method', tab as 'email' | 'phone');
  };

  return (
    <KeyboardAvoid className="main-area" scrollEnabled={false}>
      <Header
        title={t('auth.login.title')}
        subtitle={t('auth.login.subtitle')}
      />
      <Tabs value={tab} onValueChange={handleTab} className="w-full mt-10">
        <TabsList>
          <TabsTrigger value="phone">
            <Text>{t('auth.register.phoneTab')}</Text>
          </TabsTrigger>
          <TabsTrigger value="email">
            <Text>{t('auth.register.emailTab')}</Text>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="email" className="gap-y-6 mt-10">
          <FormField
            control={control}
            name="email"
            label={t('auth.email')}
            required
            render={({ field }) => (
              <Input
                {...field}
                placeholder={t('auth.emailPlaceholder')}
                keyboardType="email-address"
                returnKeyType="next"
                autoCapitalize="none"
                onSubmitEditing={() => setFocus('password')}
              />
            )}
          />

          <FormField
            control={control}
            name="password"
            label={t('auth.password')}
            required
            render={({ field }) => (
              <PasswordInput
                {...field}
                placeholder={t('auth.passwordPlaceholder')}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
              />
            )}
          />
        </TabsContent>
        <TabsContent value="phone" className="gap-y-6 mt-10">
          <FormField
            control={control}
            name="phone"
            label={t('auth.phone')}
            required
            render={({ field }) => (
              <PhoneInput
                {...field}
                placeholder={t('auth.phonePlaceholder')}
                returnKeyType="next"
                defaultCountry="UZ"
                onSubmitEditing={() => setFocus('password')}
              />
            )}
          />

          <FormField
            control={control}
            name="password"
            label={t('auth.password')}
            required
            render={({ field }) => (
              <PasswordInput
                {...field}
                placeholder={t('auth.passwordPlaceholder')}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
              />
            )}
          />
        </TabsContent>
      </Tabs>

      <Button
        className="my-10"
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
        size="lg"
      >
        <Text>
          {isPending ? t('common.buttons.loading') : t('common.buttons.login')}
        </Text>
      </Button>

      <View className="flex flex-row justify-center items-center">
        <Text className="text-sm text-muted-foreground text-center">
          {t('auth.login.noAccount')}
        </Text>
        <Button
          variant="link"
          onPress={() => {
            Feedback.medium();
            router.push(routes.auth.register);
          }}
        >
          <Text className="font-body">{t('auth.login.register')}</Text>
        </Button>
      </View>

      <View className="justify-center items-center mt-4">
        <Pressable
          onPress={() => {
            Feedback.soft();
            router.push(routes.auth.forgot_password);
          }}
        >
          <Text className="font-caption underline">
            {t('auth.login.forgotPassword')}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoid>
  );
}
