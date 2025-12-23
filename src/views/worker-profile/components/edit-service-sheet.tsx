import CustomBottomSheet from '@/components/shared/bottom-sheet';
import FormField from '@/components/shared/form-field';
import { Button, Text } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import type { IService } from '@/types/worker.type';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { forwardRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { serviceSchema, type ServiceFormData } from '../utils/helpers';

interface EditServiceSheetProps {
  service: IService | null;
  onSave: (serviceId: string, data: ServiceFormData) => void;
  onDelete: (serviceId: string) => void;
}

/**
 * Edit Service Bottom Sheet Component
 * Form for editing an existing service
 */
export const EditServiceSheet = forwardRef<
  BottomSheetModal,
  EditServiceSheetProps
>(({ service, onSave, onDelete }, ref) => {
  const insets = useSafeAreaInsets();

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service
      ? {
          name: service.name,
          description: service.description,
          durationMins: service.durationMins,
          price: service.price,
        }
      : undefined,
  });

  useEffect(() => {
    if (service) {
      form.reset({
        name: service.name,
        description: service.description,
        durationMins: service.durationMins,
        price: service.price,
      });
    }
  }, [service, form]);

  const handleSubmit = form.handleSubmit((data) => {
    if (service) {
      onSave(service.id, data);
      if (ref && 'current' in ref) {
        ref.current?.dismiss();
      }
    }
  });

  const handleDelete = () => {
    if (service) {
      onDelete(service.id);
      if (ref && 'current' in ref) {
        ref.current?.dismiss();
      }
    }
  };

  if (!service) return null;

  return (
    <CustomBottomSheet
      ref={ref}
      index={0}
      snapPoints={['80%']}
      scrollEnabled
      scrollConfig={{
        contentContainerStyle: {
          paddingBottom: insets.bottom + 20,
        },
      }}
    >
      <View className="mb-6">
        <Text className="font-heading text-xl text-foreground">
          Edit Service
        </Text>
        <Text className="font-body text-muted-foreground mt-1">
          Update service details
        </Text>
      </View>

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
        name="durationMins"
        label="Duration (minutes)"
        required
        className="mt-4"
        render={({ field }) => (
          <NumberInput
            placeholder="60"
            maxDecimals={0}
            value={field.value?.toString() || ''}
            onNumberChange={(text) => {
              const num = parseInt(text, 10);
              field.onChange(isNaN(num) ? 0 : num);
            }}
            onBlur={field.onBlur}
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

      <View className="mt-6 gap-3">
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
    </CustomBottomSheet>
  );
});

EditServiceSheet.displayName = 'EditServiceSheet';
