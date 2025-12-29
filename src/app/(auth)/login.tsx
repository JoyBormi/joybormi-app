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
import { useLogin } from '@/hooks/auth/use-login';
import { Feedback } from '@/lib/haptics';
import { normalizePhone } from '@/lib/utils';

import { AuthHeader, LoginFormType, loginSchema } from '@/views/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [tab, setTab] = useState('phone');
  const { control, handleSubmit, setValue, clearErrors } =
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
      onSuccess: (data) => {
        // Navigate to home after successful login
        router.replace('/');
      },
    });
  };

  const handleTab = (tab: string) => {
    setValue('method', tab as 'email' | 'phone');
    clearErrors();
    setTab(tab);
  };

  return (
    <KeyboardAvoid>
      <View className="main-area">
        <View className="pt-20">
          <AuthHeader
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
                  />
                )}
              />
            </TabsContent>
          </Tabs>
        </View>

        <Button
          className="my-10"
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
        >
          <Text>
            {isPending
              ? t('common.buttons.loading')
              : t('common.buttons.login')}
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
              router.push('/(auth)/register');
            }}
          >
            <Text className="font-primary">{t('auth.login.register')}</Text>
          </Button>
        </View>

        <View className="justify-center items-center mt-4">
          <TouchableOpacity
            onPress={() => {
              Feedback.soft();
              router.push('/(auth)/forgot-pwd');
            }}
          >
            <Text className="font-primary underline text-sm">
              {t('auth.login.forgotPassword')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoid>
  );
}
