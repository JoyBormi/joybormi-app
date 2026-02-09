import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KeyboardAvoid } from '@/components/shared';
import FormField from '@/components/shared/form-field';
import { Header } from '@/components/shared/header';
import { Button, PasswordInput, Text } from '@/components/ui';
import { ChangePasswordFormData, changePasswordSchema } from '@/lib/validation';
import { toast } from '@/providers/toaster';

export default function ChangePasswordScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handlePasswordUpdate = useCallback(() => {
    toast.error({ title: 'Password updates are not available yet.' });
  }, []);

  return (
    <KeyboardAvoid
      className="main-area"
      contentContainerStyle={{
        paddingBottom: insets.bottom + 50,
        paddingTop: 12,
        rowGap: 24,
      }}
    >
      <Header title="Change Password" subtitle={t('auth.resetPwd.subtitle')} />

      <FormField
        control={form.control}
        name="currentPassword"
        label="Current password"
        render={({ field }) => (
          <PasswordInput
            {...field}
            placeholder="Enter current password"
            returnKeyType="next"
            onSubmitEditing={() => form.setFocus('newPassword')}
          />
        )}
      />

      <FormField
        control={form.control}
        name="newPassword"
        label="New password"
        render={({ field }) => (
          <PasswordInput
            {...field}
            placeholder={t('auth.newPasswordPlaceholder')}
            returnKeyType="next"
            onSubmitEditing={() => form.setFocus('confirmPassword')}
          />
        )}
      />

      <FormField
        control={form.control}
        name="confirmPassword"
        label="Confirm new password"
        render={({ field }) => (
          <PasswordInput
            {...field}
            placeholder={t('auth.confirmPasswordPlaceholder')}
            returnKeyType="done"
            onSubmitEditing={() => form.handleSubmit(handlePasswordUpdate)()}
          />
        )}
      />

      <Button
        size="lg"
        onPress={form.handleSubmit(handlePasswordUpdate)}
        loading={form.formState.isSubmitting}
        disabled={form.formState.isSubmitting}
      >
        <Text>Update password</Text>
      </Button>
    </KeyboardAvoid>
  );
}
