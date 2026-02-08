import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FormField from '@/components/shared/form-field';
import { Header } from '@/components/shared/header';
import KeyboardAvoid from '@/components/shared/keyboard-avoid';
import { Loading } from '@/components/status-screens';
import { Button, PhoneInput, Select, Text, Textarea } from '@/components/ui';
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
  const { mutateAsync, isPending } = useUpdateWorkerProfile();

  const form = useForm<WorkerProfileFormData>({
    resolver: zodResolver(workerProfileSchema),
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      jobTitle: '',
      bio: '',
      email: '',
      phone: '',
      instagram: '',
      languages: [],
    },
  });

  useEffect(() => {
    if (!worker) return;

    form.reset({
      username: worker.username ?? '',
      firstName: worker.firstName ?? '',
      lastName: worker.lastName ?? '',
      jobTitle: worker.jobTitle ?? '',
      bio: worker.bio ?? '',
      email: worker.email ?? '',
      phone: worker.phone ?? '',
      instagram: worker.instagram ?? '',
      languages: worker.languages ?? [],
    });
  }, [worker, form]);

  const onSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(data);
    toast.success({ title: 'Profile updated' });
    router.back();
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
        name="username"
        label="Username"
        required
        render={({ field }) => (
          <Input
            placeholder="Your username"
            {...field}
            returnKeyType="next"
            onSubmitEditing={() => form.setFocus('firstName')}
          />
        )}
      />

      <FormField
        control={form.control}
        name="firstName"
        label="First Name"
        className="mt-4"
        render={({ field }) => (
          <Input
            placeholder="First name"
            {...field}
            returnKeyType="next"
            onSubmitEditing={() => form.setFocus('lastName')}
          />
        )}
      />

      <FormField
        control={form.control}
        name="lastName"
        label="Last Name"
        className="mt-4"
        render={({ field }) => (
          <Input
            placeholder="Last name"
            {...field}
            returnKeyType="next"
            onSubmitEditing={() => form.setFocus('jobTitle')}
          />
        )}
      />

      <FormField
        control={form.control}
        name="jobTitle"
        label="Job Title"
        required
        className="mt-4"
        render={({ field }) => (
          <Input
            placeholder="e.g. Senior Stylist"
            {...field}
            returnKeyType="next"
            onSubmitEditing={() => form.setFocus('bio')}
          />
        )}
      />

      <FormField
        control={form.control}
        name="bio"
        label="Bio"
        required
        className="mt-4"
        render={({ field }) => (
          <Textarea
            placeholder="Tell us about yourself"
            {...field}
            returnKeyType="next"
            onSubmitEditing={() => form.setFocus('email')}
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
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            {...field}
            returnKeyType="next"
            onSubmitEditing={() => form.setFocus('phone')}
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
          <PhoneInput
            {...field}
            returnKeyType="next"
            onSubmitEditing={() => form.setFocus('languages')}
          />
        )}
      />

      <FormField
        control={form.control}
        name="languages"
        label="Languages"
        required
        className="mt-4"
        render={({ field }) => (
          <Select
            onChangeText={field.onChangeText}
            value={field.value}
            multi
            options={[
              { label: 'Uzbek', value: 'uz' },
              { label: 'English', value: 'en' },
              { label: 'Russian', value: 'ru' },
            ]}
          />
        )}
      />

      <FormField
        control={form.control}
        name="instagram"
        label="Instagram"
        className="mt-4"
        render={({ field }) => (
          <Input
            placeholder="@username"
            autoCapitalize="none"
            {...field}
            returnKeyType="done"
            onSubmitEditing={() => form.setFocus('instagram')}
          />
        )}
      />

      <Button
        onPress={onSubmit}
        className=" mt-6 min-w-fit self-end"
        style={{ marginBottom: insets.bottom + 50 }}
        disabled={!form.formState.isDirty}
        loading={isPending}
        size="lg"
      >
        <Text>Save Changes</Text>
      </Button>
    </KeyboardAvoid>
  );
};

export default EditProfileScreen;
