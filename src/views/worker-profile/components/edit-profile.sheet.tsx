import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { forwardRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CustomBottomSheet from '@/components/shared/bottom-sheet';
import FormField from '@/components/shared/form-field';
import KeyboardAvoid from '@/components/shared/keyboard-avoid';
import { Button, Text } from '@/components/ui';
import { Input } from '@/components/ui/input';

import {
  workerProfileSchema,
  type WorkerProfileFormData,
} from '../utils/helpers';

import type { IWorker } from '@/types/worker.type';

interface EditProfileSheetProps {
  worker: IWorker;
  onSave: (data: WorkerProfileFormData) => void;
}

/**
 * Edit Profile Bottom Sheet Component
 * Form for editing worker profile information
 */
export const EditProfileSheet = forwardRef<
  BottomSheetModal,
  EditProfileSheetProps
>(({ worker, onSave }, ref) => {
  const insets = useSafeAreaInsets();
  const form = useForm<WorkerProfileFormData>({
    resolver: zodResolver(workerProfileSchema),
    defaultValues: {
      name: worker.name,
      role: worker.role,
      bio: worker.bio,
      specialties: worker.specialties,
      email: worker.email,
      phone: worker.phone,
      avatar: worker.avatar,
      coverImage: worker.coverImage,
    },
  });

  useEffect(() => {
    form.reset({
      name: worker.name,
      role: worker.role,
      bio: worker.bio,
      specialties: worker.specialties,
      email: worker.email,
      phone: worker.phone,
      avatar: worker.avatar,
      coverImage: worker.coverImage,
    });
  }, [worker, form]);

  const handleSubmit = form.handleSubmit((data) => {
    onSave(data);
    if (ref && 'current' in ref) {
      ref.current?.dismiss();
    }
  });

  return (
    <>
      <CustomBottomSheet
        ref={ref}
        index={0}
        snapPoints={['90%', '99%']}
        scrollEnabled
        scrollConfig={{
          contentContainerStyle: {
            paddingBottom: insets.bottom + 100,
          },
          showsVerticalScrollIndicator: false,
        }}
      >
        <KeyboardAvoid>
          <View className="mb-6">
            <Text className="font-heading text-xl text-foreground">
              Edit Profile
            </Text>
            <Text className="font-body text-muted-foreground mt-1">
              Update your profile information
            </Text>
          </View>

          <FormField
            control={form.control}
            name="name"
            label="Full Name"
            required
            render={({ field }) => (
              <Input
                placeholder="Enter your full name"
                value={field.value as string}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />

          <FormField
            control={form.control}
            name="role"
            label="Role/Title"
            required
            className="mt-4"
            render={({ field }) => (
              <Input
                placeholder="e.g. Senior Stylist"
                value={field.value as string}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            label="Bio"
            required
            className="mt-4 min-h-[120px]"
            render={({ field }) => (
              <Input
                placeholder="Tell us about yourself"
                multiline
                numberOfLines={4}
                className="min-h-[100px]"
                value={field.value as string}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />

          <FormField
            control={form.control}
            name="email"
            label="Email"
            required
            className="mt-4"
            render={({ field }) => (
              <Input
                placeholder="your.email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={field.value as string}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            label="Phone"
            required
            className="mt-4"
            render={({ field }) => (
              <Input
                placeholder="+1 (555) 123-4567"
                keyboardType="phone-pad"
                value={field.value as string}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />

          <View className="mt-6 gap-3">
            <Button onPress={handleSubmit} className="bg-primary">
              <Text className="font-subtitle text-primary-foreground">
                Save Changes
              </Text>
            </Button>
            <Button
              onPress={() => {
                if (ref && 'current' in ref) {
                  ref.current?.dismiss();
                }
              }}
              variant="outline"
            >
              <Text className="font-subtitle text-foreground">Cancel</Text>
            </Button>
          </View>
        </KeyboardAvoid>
      </CustomBottomSheet>
    </>
  );
});

EditProfileSheet.displayName = 'EditProfileSheet';
