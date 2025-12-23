import CustomBottomSheet from '@/components/shared/bottom-sheet';
import FormField from '@/components/shared/form-field';
import { Button, Text } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { serviceSchema, type ServiceFormData } from '../utils/helpers';

interface AddServiceSheetProps {
  onSave: (data: ServiceFormData) => void;
}

/**
 * Add Service Bottom Sheet Component
 * Form for adding a new service
 */
export const AddServiceSheet = forwardRef<
  BottomSheetModal,
  AddServiceSheetProps
>(({ onSave }, ref) => {
  const insets = useSafeAreaInsets();

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      description: '',
      durationMins: 60,
      price: '',
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSave(data);
    form.reset();
    if (ref && 'current' in ref) {
      ref.current?.dismiss();
    }
  });

  return (
    <CustomBottomSheet
      ref={ref}
      index={0}
      snapPoints={['75%']}
      scrollEnabled
      scrollConfig={{
        contentContainerStyle: {
          paddingBottom: insets.bottom + 20,
        },
      }}
    >
      <View className="mb-6">
        <Text className="font-heading text-xl text-foreground">
          Add New Service
        </Text>
        <Text className="font-body text-muted-foreground mt-1">
          Create a new service offering
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
            Add Service
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

AddServiceSheet.displayName = 'AddServiceSheet';
