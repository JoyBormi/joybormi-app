import FormField from '@/components/shared/form-field';
import { Button, Text } from '@/components/ui';
import { Input } from '@/components/ui/input';
import Icons from '@/lib/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { serviceSchema, type ServiceFormData } from '../utils/validation';

interface AddServiceModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: ServiceFormData) => void;
}

/**
 * Add Service Modal Component
 * Form for adding a new service
 */
export const AddServiceModal: React.FC<AddServiceModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      description: '',
      duration_mins: 60,
      price: '',
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSave(data);
    form.reset();
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
              Add New Service
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
                Add Service
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
