import CustomBottomSheet from '@/components/shared/bottom-sheet';
import FormField from '@/components/shared/form-field';
import KeyboardAvoid from '@/components/shared/keyboard-avoid';
import { Button, Text } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import type { IService } from '@/types/worker.type';
import { validateFormErrors } from '@/utils/validation';
import {
  ServiceFormData,
  serviceSchema,
} from '@/views/worker-profile/utils/helpers';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { forwardRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface UpsertServiceSheetProps {
  service?: IService | null;
  onSave: (serviceId: string | null, data: ServiceFormData) => void;
  onDelete?: (serviceId: string) => void;
}

export const UpsertServiceSheet = forwardRef<
  BottomSheetModal,
  UpsertServiceSheetProps
>(({ service, onSave, onDelete }, ref) => {
  const isEdit = !!service;
  const insets = useSafeAreaInsets();

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    mode: 'onChange',
    defaultValues: {
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

  useEffect(() => {
    const firstError = validateFormErrors(form.formState.errors);
    if (firstError) {
      form.setFocus(firstError);
    }
  }, [form.formState.errors, form]);

  const handleSubmit = form.handleSubmit(async (data) => {
    const safeData = {
      ...data,
      durationMins: Math.max(1, data.durationMins),
      price: data.price.replace(/[^\d.]/g, ''),
    };

    onSave(service?.id || null, safeData);

    form.reset();
    ref && 'current' in ref && ref.current?.dismiss();
  });

  const handleDelete = () => {
    if (!service || !onDelete) return;

    Alert.alert('Delete Service', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          onDelete(service.id);
          ref && 'current' in ref && ref.current?.dismiss();
        },
      },
    ]);
  };

  return (
    <CustomBottomSheet
      ref={ref}
      index={0}
      snapPoints={['90%', '99%']}
      scrollEnabled
      enablePanDownToClose={false}
      scrollConfig={{
        contentContainerStyle: {
          paddingBottom: insets.bottom + 120,
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
              value={field.value}
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
          className="mt-4 min-h-[130px]"
          render={({ field }) => (
            <Input
              placeholder="Describe your service"
              multiline
              numberOfLines={3}
              className="min-h-[100px]"
              value={field.value}
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
              value={field.value.toString()}
              onNumberChange={(text) => {
                const num = parseInt(text, 10);
                field.onChange(isNaN(num) ? 1 : Math.max(1, num));
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
            <NumberInput
              placeholder="$80"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />

        <View className="mt-6 gap-4 flex-row">
          {isEdit && onDelete && (
            <Button
              onPress={handleDelete}
              variant="outline"
              size="action"
              className="flex-[0.3] border-destructive"
            >
              <Text className="text-destructive">Delete</Text>
            </Button>
          )}

          <Button
            onPress={handleSubmit}
            disabled={!form.formState.isValid}
            size="action"
            className="flex-[0.7]"
          >
            <Text>{isEdit ? 'Save' : 'Add'}</Text>
          </Button>
        </View>
      </KeyboardAvoid>
    </CustomBottomSheet>
  );
});

UpsertServiceSheet.displayName = 'UpsertServiceSheet';
