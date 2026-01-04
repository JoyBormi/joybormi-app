import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FormField from '@/components/shared/form-field';
import KeyboardAvoid from '@/components/shared/keyboard-avoid';
import {
  LoadingScreen,
  NotFoundScreen,
} from '@/components/shared/status-screens';
import { Button, Text, Textarea } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import {
  useCreateService,
  useDeleteService,
  useGetServiceDetail,
  useUpdateService,
} from '@/hooks/service';
import { useUserStore } from '@/stores';
import { ServiceOwnerType } from '@/types/service.type';
import { EUserType } from '@/types/user.type';
import { validateFormErrors } from '@/utils/validation';
import {
  ServiceFormData,
  serviceSchema,
} from '@/views/worker-profile/utils/helpers';

/**
 * Add/Edit Service Screen
 * Route: /(slide-screens)/add-service?id={brandId}&serviceId={serviceId}
 * - id: brandId (required for creating new service)
 * - serviceId: service id (optional, for editing existing service)
 */
const UpsertServiceScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useUserStore();
  const params = useLocalSearchParams<{ id?: string; serviceId?: string }>();

  const brandId = params.id;
  const serviceId = params.serviceId;
  const isEdit = !!serviceId;

  // Fetch service data if editing
  const { data: service, isLoading: isLoadingService } =
    useGetServiceDetail(serviceId);

  // Mutations
  const createServiceMutation = useCreateService(brandId || '');
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();

  const isSubmitting =
    createServiceMutation.isPending ||
    updateServiceMutation.isPending ||
    deleteServiceMutation.isPending;

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: null,
      durationMins: 60,
      price: 0,
      ownerType:
        user?.role === EUserType.CREATOR
          ? ServiceOwnerType.BRAND
          : ServiceOwnerType.WORKER,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (isEdit && service) {
      form.reset({
        name: service.name,
        description: service.description,
        durationMins: service.durationMins,
        price: service.price,
        ownerType: service.ownerType,
      });
    }
  }, [isEdit, service, form]);

  // Auto-focus first error field
  useEffect(() => {
    const firstError = validateFormErrors(form.formState.errors);
    if (firstError) {
      form.setFocus(firstError);
    }
  }, [form.formState.errors, form]);

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      if (isEdit && serviceId) {
        // Update existing service
        await updateServiceMutation.mutateAsync({
          serviceId,
          payload: data,
        });
        Alert.alert('Success', 'Service updated successfully');
      } else if (brandId) {
        // Create new service
        await createServiceMutation.mutateAsync(data);
        Alert.alert('Success', 'Service created successfully');
      }
      router.back();
    } catch (error) {
      console.error('Failed to save service:', error);
      // Error is handled by global error handler
    }
  });

  const handleDelete = () => {
    if (!serviceId) return;

    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteServiceMutation.mutateAsync(serviceId);
              Alert.alert('Success', 'Service deleted successfully');
              router.back();
            } catch (error) {
              console.error('Failed to delete service:', error);
            }
          },
        },
      ],
    );
  };

  // Loading state
  if (isEdit && isLoadingService) {
    return <LoadingScreen />;
  }

  // Not found state
  if (isEdit && !service && !isLoadingService) {
    return (
      <NotFoundScreen
        title="Service Not Found"
        message="The service you are looking for does not exist or has been removed."
        actionLabel="Go Back"
        onAction={() => router.back()}
      />
    );
  }

  // Missing brandId for new service
  if (!isEdit && !brandId) {
    return (
      <NotFoundScreen
        title="Invalid Request"
        message="Brand ID is required to create a new service."
        actionLabel="Go Back"
        onAction={() => router.back()}
      />
    );
  }

  return (
    <KeyboardAvoid className="main-area">
      {/* Header */}
      <View className="mb-6">
        <Text className="font-heading text-2xl text-foreground">
          {isEdit ? 'Edit Service' : 'Add New Service'}
        </Text>
        <Text className="font-body text-sm text-muted-foreground mt-2">
          {isEdit
            ? 'Update service details below'
            : 'Create a new service offering for your brand'}
        </Text>
      </View>

      {/* Form Fields */}
      <View className="gap-4">
        <FormField
          control={form.control}
          name="name"
          label="Service Name"
          required
          render={({ field }) => (
            <Input
              placeholder="e.g. Hair Coloring, Massage, Consultation"
              {...field}
              editable={!isSubmitting}
            />
          )}
        />

        <FormField
          control={form.control}
          name="description"
          label="Description"
          className="min-h-[120px]"
          message="Provide a detailed description of the service"
          render={({ field }) => (
            <Textarea
              placeholder="Describe what this service includes..."
              {...field}
              editable={!isSubmitting}
            />
          )}
        />

        <FormField
          control={form.control}
          name="durationMins"
          label="Duration (minutes)"
          required
          message="How long does this service take?"
          render={({ field }) => (
            <NumberInput
              placeholder="60"
              maxDecimals={0}
              value={field.value?.toString() || '60'}
              onNumberChange={(text) => {
                const num = parseInt(text, 10);
                field.onChange(isNaN(num) ? 15 : Math.max(15, num));
              }}
              onBlur={field.onBlur}
              editable={!isSubmitting}
            />
          )}
        />

        <FormField
          control={form.control}
          name="price"
          label="Price"
          required
          message="Service price in your local currency"
          render={({ field }) => (
            <NumberInput
              placeholder="80"
              {...field}
              onNumberChange={(text) => {
                const num = parseFloat(text);
                field.onChangeText(num);
              }}
              editable={!isSubmitting}
            />
          )}
        />
      </View>

      {/* Action Buttons */}
      <View className="mt-8 gap-3">
        {isEdit && (
          <Button
            onPress={handleDelete}
            variant="outline"
            size="action"
            className="border-destructive"
            disabled={isSubmitting}
          >
            {deleteServiceMutation.isPending ? (
              <ActivityIndicator size="small" className="text-destructive" />
            ) : (
              <Text className="text-destructive font-title">
                Delete Service
              </Text>
            )}
          </Button>
        )}

        <Button
          onPress={handleSubmit}
          disabled={!form.formState.isValid || isSubmitting}
          size="action"
        >
          {isSubmitting ? (
            <ActivityIndicator
              size="small"
              className="text-primary-foreground"
            />
          ) : (
            <Text className="font-title">
              {isEdit ? 'Save Changes' : 'Create Service'}
            </Text>
          )}
        </Button>

        <Button
          onPress={() => router.back()}
          variant="ghost"
          size="action"
          disabled={isSubmitting}
        >
          <Text className="text-muted-foreground font-title">Cancel</Text>
        </Button>
      </View>
    </KeyboardAvoid>
  );
};

export default UpsertServiceScreen;
