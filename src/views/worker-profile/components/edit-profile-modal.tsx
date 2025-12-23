import FormField from '@/components/shared/form-field';
import { Button, Text } from '@/components/ui';
import { Input } from '@/components/ui/input';
import Icons from '@/lib/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import {
  workerProfileSchema,
  type WorkerProfileFormData,
} from '../utils/validation';
import type { Worker } from '../worker-profile.d';

interface EditProfileModalProps {
  visible: boolean;
  worker: Worker;
  onClose: () => void;
  onSave: (data: WorkerProfileFormData) => void;
}

/**
 * Edit Profile Modal Component
 * Form for editing worker profile information
 */
export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  worker,
  onClose,
  onSave,
}) => {
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

  const handleSubmit = form.handleSubmit((data) => {
    onSave(data);
    onClose();
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <View className="flex-1 mt-20 bg-background rounded-t-3xl">
          {/* Header */}
          <View className="flex-row items-center justify-between p-6 border-b border-border">
            <Text className="font-heading text-xl text-foreground">
              Edit Profile
            </Text>
            <Pressable onPress={onClose}>
              <Icons.X size={24} className="text-foreground" />
            </Pressable>
          </View>

          {/* Form */}
          <ScrollView className="flex-1 px-6 py-4">
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
              className="mt-4"
              render={({ field }) => (
                <Input
                  placeholder="Tell us about yourself"
                  multiline
                  numberOfLines={4}
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

            <View className="h-6" />
          </ScrollView>

          {/* Footer */}
          <View className="p-6 border-t border-border gap-3">
            <Button onPress={handleSubmit} className="bg-primary">
              <Text className="font-subtitle text-primary-foreground">
                Save Changes
              </Text>
            </Button>
            <Button onPress={onClose} variant="outline">
              <Text className="font-subtitle text-foreground">Cancel</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};
