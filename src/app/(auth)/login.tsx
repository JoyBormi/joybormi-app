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
import { Feedback } from '@/lib/haptics';
import { useUserStore } from '@/stores';
import { EUserType } from '@/types/user.type';

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
  const { setUser, setIsLoggedIn, setAppType } = useUserStore();
  const { control, handleSubmit, setValue } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      method: 'phone',
      email: '',
      phone: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormType) => {
    setUser({
      id: 'test',
      type: EUserType.CREATOR,
      username: 'Test User',
      first_name: '',
      last_name: '',
      avatar: '',
      phone: '+998999999999',
      email: 'test@gmail.com',
      tokens: {
        accessToken: '',
        refreshToken: '',
      },
    });
    setIsLoggedIn(true);
    setAppType(EUserType.CREATOR);
    router.replace('/');
  };

  const handleTab = (tab: string) => {
    setValue('method', tab as 'email' | 'phone');
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
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={t('auth.emailPlaceholder')}
                    keyboardType="email-address"
                    returnKeyType="next"
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
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
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
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
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
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={t('auth.passwordPlaceholder')}
                    secureTextEntry
                    returnKeyType="done"
                  />
                )}
              />
            </TabsContent>
          </Tabs>
        </View>

        <Button className="my-10" onPress={handleSubmit(onSubmit)}>
          <Text>{t('common.buttons.login')}</Text>
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
