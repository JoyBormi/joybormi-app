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
import { NumberInput } from '@/components/ui/number-input';

import { serviceSchema, type ServiceFormData } from '../utils/helpers';

import type { IService } from '@/types/worker.type';

interface UpsertServiceSheetProps {
  service?: IService | null;
  onSave: (serviceId: string | null, data: ServiceFormData) => void;
  onDelete?: (serviceId: string) => void;
}

/**
 * Upsert Service Bottom Sheet Component
 * Form for creating or editing a service
 */
export const UpsertServiceSheet = forwardRef<
  BottomSheetModal,
  UpsertServiceSheetProps
>(({ service, onSave, onDelete }, ref) => {
  const isEdit = !!service;

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
      : {
          name: '',
          description: '',
          durationMins: 60,
          price: '',
        },
  });

  useEffect(() => {
    if (service) {
      form.reset({
        name: service.name,
        description: service.description,
        durationMins: service.durationMins,
        price: service.price,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        durationMins: 60,
        price: '',
      });
    }
  }, [service, form]);

  const handleSubmit = form.handleSubmit((data) => {
    onSave(service?.id || null, data);
    form.reset();
    if (ref && 'current' in ref) {
      ref.current?.dismiss();
    }
  });

  const handleDelete = () => {
    if (service && onDelete) {
      onDelete(service.id);
      if (ref && 'current' in ref) {
        ref.current?.dismiss();
      }
    }
  };

  return (
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
            {isEdit ? 'Edit Service' : 'Add New Service'}
          </Text>
          <Text className="font-body text-muted-foreground mt-1">
            {isEdit
              ? 'Update service details'
              : 'Create a new service offering'}
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
          className="mt-4 min-h-[120px]"
          render={({ field }) => (
            <Input
              placeholder="Describe your service"
              multiline
              numberOfLines={3}
              className="min-h-[100px]"
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
              {isEdit ? 'Save Changes' : 'Add Service'}
            </Text>
          </Button>
          {isEdit && onDelete && (
            <Button onPress={handleDelete} variant="destructive">
              <Text className="font-subtitle text-destructive-foreground">
                Delete Service
              </Text>
            </Button>
          )}
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
  );
});

UpsertServiceSheet.displayName = 'UpsertServiceSheet';
