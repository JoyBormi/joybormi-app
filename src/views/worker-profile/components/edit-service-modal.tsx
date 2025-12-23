import { Button, Text } from '@/components/ui';
import FormField from '@/components/shared/form-field';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { serviceSchema, type ServiceFormData } from '../utils/validation';
import type { Service } from '../worker-profile.d';
import Icons from '@/lib/icons';

interface EditServiceModalProps {
  visible: boolean;
  service: Service | null;
  onClose: () => void;
  onSave: (serviceId: string, data: ServiceFormData) => void;
  onDelete: (serviceId: string) => void;
}

/**
 * Edit Service Modal Component
 * Form for editing an existing service
 */
export const EditServiceModal: React.FC<EditServiceModalProps> = ({
  visible,
  service,
  onClose,
  onSave,
  onDelete,
}) => {
  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service
      ? {
          name: service.name,
          description: service.description,
          duration_mins: service.duration_mins,
          price: service.price,
        }
      : undefined,
  });

  useEffect(() => {
    if (service) {
      form.reset({
        name: service.name,
        description: service.description,
        duration_mins: service.duration_mins,
        price: service.price,
      });
    }
  }, [service, form]);

  const handleSubmit = form.handleSubmit((data) => {
    if (service) {
      onSave(service.id, data);
      onClose();
    }
  });

  const handleDelete = () => {
    if (service) {
      onDelete(service.id);
      onClose();
    }
  };

  if (!service) return null;

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
              Edit Service
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
              label="Service Name"
              required
              render={({ field }) => (
                <Input
                  placeholder="e.g. Hair Coloring"
                  value={field.value as string}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />

            <FormField
              control={form.control}
              name="description"
              label="Description"
              required
              className="mt-4"
              render={({ field }) => (
                <Input
                  placeholder="Describe your service"
                  multiline
                  numberOfLines={3}
                  value={field.value as string}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />

            <FormField
              control={form.control}
              name="duration_mins"
              label="Duration (minutes)"
              required
              className="mt-4"
              render={({ field }) => (
                <Input
                  placeholder="60"
                  keyboardType="numeric"
                  value={field.value?.toString() || ''}
                  onChangeText={(text) => {
                    const num = parseInt(text, 10);
                    field.onChange(isNaN(num) ? 0 : num);
                  }}
                />
              )}
            />

            <FormField
              control={form.control}
              name="price"
              label="Price"
              required
              className="mt-4"
              render={({ field }) => (
                <Input
                  placeholder="$80"
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
            <Button onPress={handleDelete} variant="destructive">
              <Text className="font-subtitle text-destructive-foreground">
                Delete Service
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
