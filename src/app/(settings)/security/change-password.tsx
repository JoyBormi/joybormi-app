import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KeyboardAvoid } from '@/components/shared';
import FormField from '@/components/shared/form-field';
import { Header } from '@/components/shared/header';
import { Button, PasswordInput, Text } from '@/components/ui';
import { routes } from '@/constants/routes';
import { useChangePassword, useLogout } from '@/hooks/auth';
import { ChangePasswordFormData, changePasswordSchema } from '@/lib/validation';
import { toast } from '@/providers/toaster';
import { alert } from '@/stores/use-alert-store';

export default function ChangePasswordScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const { mutateAsync: logout } = useLogout();
  const { mutateAsync: changePassword, isPending: isChangingPassword } =
    useChangePassword();

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handlePasswordUpdate = useCallback(async () => {
    const valid = await form.trigger();
    if (!valid) return;
    const payload = form.getValues();

    await changePassword({
      ...payload,
      revokeOtherSessions: false,
    })
      .then(() => {
        form.reset();
        alert({
          title: 'Password changed successfully',
          cancelLabel: t('common.buttons.back'),
          onCancel: () => router.back(),
          confirmLabel: t('common.buttons.logout'),
          onConfirm: () => {
            logout();
            router.replace(routes.auth.login);
          },
        });
      })
      .catch((error) => {
        toast.error({ title: error.message });
      });
  }, [changePassword, form, logout, t]);

  return (
    <KeyboardAvoid
      className="main-area"
      scrollEnabled={false}
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: insets.bottom + 50,
        paddingTop: 12,
      }}
    >
      <Header title="Change Password" subtitle={t('auth.resetPwd.subtitle')} />
      <View className="flex-1 gap-md pt-xl">
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

        <View className="flex-1" />
        <Button
          size="lg"
          onPress={form.handleSubmit(handlePasswordUpdate)}
          loading={form.formState.isSubmitting || isChangingPassword}
          disabled={form.formState.isSubmitting || isChangingPassword}
        >
          <Text>Update password</Text>
        </Button>
      </View>
    </KeyboardAvoid>
  );
}
