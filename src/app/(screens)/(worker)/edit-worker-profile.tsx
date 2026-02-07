import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FormField from '@/components/shared/form-field';
import { Header } from '@/components/shared/header';
import KeyboardAvoid from '@/components/shared/keyboard-avoid';
import { Loading } from '@/components/status-screens';
import { Button, Text, Textarea } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { useGetWorkerProfile, useUpdateWorkerProfile } from '@/hooks/worker';
import { toast } from '@/providers/toaster';
import {
  WorkerProfileFormData,
  workerProfileSchema,
} from '@/views/worker-profile/utils';

const EditProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const { data: worker, isLoading } = useGetWorkerProfile();
  const { mutateAsync: updateWorkerProfile, isPending } =
    useUpdateWorkerProfile();

  const form = useForm<WorkerProfileFormData>({
    resolver: zodResolver(workerProfileSchema),
    defaultValues: {
      name: '',
      role: '',
      bio: '',
      specialties: [],
      email: '',
      phone: '',
      avatar: '',
      coverImage: '',
    },
  });

  useEffect(() => {
    if (worker) {
      form.reset({
        name: worker.username ?? '',
        role: worker.jobTitle ?? '',
        bio: worker.bio ?? '',
        specialties: worker.specialties ?? [],
        email: worker.email ?? '',
        phone: worker.phone ?? '',
        avatar: worker.avatar ?? '',
        coverImage: worker.coverImage ?? '',
      });
    }
  }, [worker, form]);

  const isFormDirty = form.formState.isDirty;

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await updateWorkerProfile({
        name: data.name,
        role: data.role,
        bio: data.bio,
        specialties: data.specialties,
        email: data.email,
        phone: data.phone,
      });
      toast.success({ title: 'Profile updated' });
      router.back();
    } catch {
      toast.error({ title: 'Failed to update profile' });
    }
  });

  if (isLoading || !worker) return <Loading />;

  return (
    <KeyboardAvoid className="main-area">
      <Header
        title="Edit Profile"
        subtitle="Update your profile information"
        className="mb-10"
      />

      <FormField
        control={form.control}
        name="name"
        label="Full Name"
        required
        render={({ field }) => (
          <Input placeholder="Enter your full name" {...field} />
        )}
      />

      <FormField
        control={form.control}
        name="role"
        label="Role/Title"
        required
        className="mt-4"
        render={({ field }) => (
          <Input placeholder="e.g. Senior Stylist" {...field} />
        )}
      />

      <FormField
        control={form.control}
        name="bio"
        label="Bio"
        required
        className="mt-4 min-h-[120px]"
        render={({ field }) => (
          <Textarea placeholder="Tell us about yourself" {...field} />
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
            {...field}
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
            {...field}
          />
        )}
      />

      <Button
        onPress={handleSubmit}
        className="bg-primary mt-6 w-2/5 self-end"
        style={{ marginBottom: insets.bottom + 50 }}
        disabled={!isFormDirty}
        loading={isPending}
        size="lg"
      >
        <Text className="font-subtitle text-primary-foreground">
          Save Changes
        </Text>
      </Button>
    </KeyboardAvoid>
  );
};

export default EditProfileScreen;
