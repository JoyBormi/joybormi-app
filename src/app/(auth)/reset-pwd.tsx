import FormField from '@/components/shared/form-field';
import KeyboardAvoid from '@/components/shared/keyboard-avoid';
import { Button, PasswordInput, Text } from '@/components/ui';
import { useResetPassword } from '@/hooks/auth';
import { AuthHeader, ResetPwdFormType, resetPwdSchema } from '@/views/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

export default function ResetPwdScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ resetToken?: string }>();
  const { mutate: resetPassword, isPending } = useResetPassword();

  const { control, handleSubmit } = useForm<ResetPwdFormType>({
    resolver: zodResolver(resetPwdSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const handleResetPassword = async (data: ResetPwdFormType) => {
    const resetToken = params.resetToken;
    if (!resetToken) {
      console.error('[Reset Password] No reset token provided');
      return;
    }

    resetPassword(
      {
        resetToken,
        password: data.password,
        confirmPassword: data.confirmPassword,
      },
      {
        onSuccess: () => {
          router.replace('/(auth)/login');
        },
      },
    );
  };

  return (
    <KeyboardAvoid className="main-area">
      <View className="pt-20">
        <AuthHeader
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
