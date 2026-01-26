import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BlockedSheet, BlockedSheetRef } from '@/components/modals/block-sheet';
import FormField from '@/components/shared/form-field';
import { Header } from '@/components/shared/header';
import KeyboardAvoid from '@/components/shared/keyboard-avoid';
import { Button, Text, Textarea } from '@/components/ui';
import { Input } from '@/components/ui/input';
import {
  WorkerProfileFormData,
  workerProfileSchema,
} from '@/views/worker-profile/utils';

import type { IWorker } from '@/types/worker.type';

interface EditProfileScreenProps {
  worker: IWorker;
}

/**
 * Edit Profile Bottom Sheet Component
 * Form for editing worker profile information
 */
const EditProfileScreen = ({
  worker = {
    id: 'worker-123',
    userId: 'worker-123',
    brandId: 'brand-123',
    name: 'Sarah Johnson',
    role: 'Senior Stylist',
    avatar: 'https://i.pravatar.cc/150?img=5',
    coverImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035',
    bio: 'Passionate hair stylist with 8+ years of experience in color treatments and modern cuts.',
    specialties: ['Hair Coloring', 'Balayage', 'Haircuts', 'Styling'],
    rating: 4.9,
    reviewCount: 127,
    status: 'active',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 123-4567',
  },
}: EditProfileScreenProps) => {
  const insets = useSafeAreaInsets();
  const blockedSheetRef = useRef<BlockedSheetRef>(null);
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

  const isFormDirty = form.formState.isDirty;

  //   useEffect(() => {
  //     form.reset({
  //       name: worker.name,
  //       role: worker.role,
  //       bio: worker.bio,
  //       specialties: worker.specialties,
  //       email: worker.email,
  //       phone: worker.phone,
  //       avatar: worker.avatar,
  //       coverImage: worker.coverImage,
  //     });
  //   }, [worker, form]);

  const handleSubmit = form.handleSubmit((data) => {
    console.log(`STRINGIFIED 👉:`, JSON.stringify(data, null, 2));
  });

  return (
    <KeyboardAvoid
      className="bg-background px-4"
      scrollConfig={{ showsVerticalScrollIndicator: false }}
    >
      <Header
        title="Edit Profile"
        subtitle="Update your profile information"
        className="mb-10"
        onGoBack={() => {
          if (isFormDirty) {
            blockedSheetRef.current?.show();
          } else {
            router.back();
          }
        }}
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
        size="action"
      >
        <Text className="font-subtitle text-primary-foreground">
          Save Changes
        </Text>
      </Button>
      <BlockedSheet
        ref={blockedSheetRef}
        onCancel={() => router.back()}
        onConfirm={() => blockedSheetRef.current?.hide()}
      />
    </KeyboardAvoid>
  );
};

export default EditProfileScreen;
