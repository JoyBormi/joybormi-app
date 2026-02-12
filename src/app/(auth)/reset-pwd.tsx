import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import FormField from '@/components/shared/form-field';
import { Header } from '@/components/shared/header';
import KeyboardAvoid from '@/components/shared/keyboard-avoid';
import { Button, PasswordInput, Text } from '@/components/ui';
import { routes } from '@/constants/routes';
import { useResetPassword } from '@/hooks/auth';
import { ResetPasswordFormType, resetPasswordSchema } from '@/lib/validation';
import { useAuthFlowStore } from '@/stores/use-auth-flow-store';

export default function ResetPwdScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { mutate: resetPassword, isPending } = useResetPassword();
  const { resetToken, clearResetToken } = useAuthFlowStore();

  const { control, handleSubmit } = useForm<ResetPasswordFormType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (!resetToken) {
      router.replace(routes.auth.forgot_password);
    }
  }, [resetToken, router]);

  const handleResetPassword = async (data: ResetPasswordFormType) => {
    if (!resetToken) return;

    resetPassword(
      {
        resetToken,
        password: data.password,
        confirmPassword: data.confirmPassword,
      },
      {
        onSuccess: () => {
          clearResetToken();
          router.replace(routes.auth.login);
        },
      },
    );
  };

  return (
    <KeyboardAvoid className="main-area">
      <Header
        title={t('auth.resetPwd.title')}
        subtitle={t('auth.resetPwd.subtitle')}
      />
      <View className="gap-y-6 mt-10">
        <FormField
          control={control}
          name="password"
          label={t('auth.password')}
          render={({ field }) => (
            <PasswordInput
              {...field}
              placeholder={t('auth.newPasswordPlaceholder')}
              returnKeyType="next"
            />
          )}
          required
        />

        <FormField
          control={control}
          name="confirmPassword"
          label={t('auth.confirmPassword')}
          render={({ field }) => (
            <PasswordInput
              {...field}
              placeholder={t('auth.confirmPasswordPlaceholder')}
              returnKeyType="done"
              onSubmitEditing={handleSubmit(handleResetPassword)}
            />
          )}
          required
        />
      </View>

      <Button
        className="my-10"
        onPress={handleSubmit(handleResetPassword)}
        disabled={isPending}
      >
        <Text>
          {isPending ? t('common.buttons.loading') : t('auth.resetPwd.submit')}
        </Text>
      </Button>
    </KeyboardAvoid>
  );
}
