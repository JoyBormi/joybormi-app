import FormField from '@/components/shared/form-field';
import KeyboardAvoid from '@/components/shared/keyboard-avoid';
import { Button, Input, Text } from '@/components/ui';
import { Feedback } from '@/lib/haptics';
import { AuthHeader } from '@/views/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { z } from 'zod';

/* ================= SCHEMA ================= */

const inviteCodeSchema = z.object({
  code: z
    .string()
    .length(6, 'Code must be 6 digits')
    .regex(/^\d+$/, 'Only numbers allowed'),
});

type InviteCodeForm = z.infer<typeof inviteCodeSchema>;

/* ================= SCREEN ================= */

export default function InviteCodeScreen() {
  const router = useRouter();

  const { control, handleSubmit } = useForm<InviteCodeForm>({
    resolver: zodResolver(inviteCodeSchema),
    defaultValues: { code: '' },
  });

  const onSubmit = (data: InviteCodeForm) => {
    Feedback.success();

    // UI-only dummy behavior
    console.log('Invite code entered:', data.code);

    // later → validate code → set worker role
    router.back();
  };

  return (
    <KeyboardAvoid>
      <View className="main-area pt-40">
        <AuthHeader
          title="Enter Invite Code"
          subtitle="Enter the 6-digit code provided by the creator brand"
        />
        {/* Form */}
        <View className="mt-14 gap-y-6">
          <FormField
            control={control}
            name="code"
            label="Invite Code"
            required
            render={({ field }) => (
              <Input
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder="123456"
                keyboardType="number-pad"
                returnKeyType="done"
                maxLength={6}
                textAlign="center"
                className="tracking-[6px] text-lg"
              />
            )}
          />
        </View>

        {/* Submit */}
        <Button className="my-10" onPress={handleSubmit(onSubmit)}>
          <Text>Join as Worker</Text>
        </Button>

        {/* Footer */}
        <Text className="text-center text-xs text-muted-foreground">
          Don’t have a code? Ask the creator to invite you.
        </Text>
      </View>
    </KeyboardAvoid>
  );
}
