import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FormField from '@/components/shared/form-field';
import { Header } from '@/components/shared/header';
import KeyboardAvoid from '@/components/shared/keyboard-avoid';
import { Loading, NotFoundScreen } from '@/components/status-screens';
import { Button, Select, SelectValue, Text, Textarea } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import {
  ServiceFormData,
  serviceSchema,
  useCreateService,
  useDeleteService,
  useGetServiceDetail,
  useUpdateService,
} from '@/hooks/service';
import { toast } from '@/providers/toaster';
import { useUserStore } from '@/stores';
import { alert } from '@/stores/use-alert-store';
import { normalizeInput } from '@/utils/helpers';
import { validateFormErrors } from '@/utils/validation';

/**
 * Add/Edit Service Screen
 * Route: /((screens))/add-service?id={brandId}&serviceId={serviceId}
 * - id: brandId (required for creating new service)
 * - serviceId: service id (optional, for editing existing service)
 */
const UpsertServiceScreen = () => {
  const { user } = useUserStore();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    ownerId?: string;
    serviceId?: string;
    brandId?: string;
  }>();

  const ownerId = params.ownerId ?? params.brandId;
  const serviceId = params.serviceId;
  const isEdit = !!serviceId;

  // Fetch service data if editing
  const { data: service, isLoading: isLoadingService } =
    useGetServiceDetail(serviceId);

  // Mutations
  const { mutateAsync: createService, isPending: isCreatingService } =
    useCreateService();
  const { mutateAsync: updateService, isPending: isUpdatingService } =
    useUpdateService();
  const { mutateAsync: deleteService, isPending: isDeletingService } =
    useDeleteService();

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      durationMins: '',
      price: '',
      currency: 'UZS',
      ownerType: user?.role,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (isEdit && service) {
      form.reset({
        name: service.name,
        description: service.description,
        durationMins: String(service.durationMins),
        price: service.price.toString(),
        ownerType: service.ownerType,
      });
    }
  }, [isEdit, service, form]);

  // Auto-focus first error field
  useEffect(() => {
    const firstError = validateFormErrors(form.formState.errors);
    if (firstError) {
      form.setFocus(firstError as keyof ServiceFormData);
    }
  }, [form.formState.errors, form]);

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!user?.id) return;

    if (isEdit && serviceId) {
      // Update existing service
      await updateService(
        {
          serviceId,
          payload: {
            name: data.name,
            description: data.description,
            durationMins: parseInt(data.durationMins),
            price: normalizeInput(data.price)
              ? Number(normalizeInput(data.price))
              : 0,
            currency: data.currency,
          },
        },
        {
          onSuccess(data) {
            toast.success({ title: 'Service updated successfully' });
            router.back();
          },
        },
      );
    } else if (ownerId) {
      // Create new service
      await createService(
        {
          brandId: ownerId,
          name: data.name,
          description: data.description,
          durationMins: parseInt(data.durationMins),
          price: normalizeInput(data.price)
            ? Number(normalizeInput(data.price))
            : 0,
          currency: data.currency,
          ownerId: user.id,
          ownerType: user.role,
        },
        {
          onSuccess() {
            toast.success({ title: 'Service created successfully' });
            router.back();
          },
        },
      );
    }
  });

  const handleDelete = () => {
    if (!serviceId) return;
    alert({
      title: 'Delete Service',
      subtitle:
        'Are you sure you want to delete this service? This action cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      onConfirm: async () => {
        await deleteService(serviceId).then(() => router.back());
      },
    });
  };

  // Loading state
  if (isEdit && isLoadingService) return <Loading />;

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

  // Missing ownerId for new service
  if (!isEdit && !ownerId) {
    return (
      <NotFoundScreen
        title="Invalid Request"
        message="ID is required to create a new service."
        actionLabel="Go Back"
        onAction={() => router.back()}
      />
    );
  }

  return (
    <KeyboardAvoid
      className="main-area"
      scrollConfig={{
        contentContainerStyle: {
          paddingBottom: insets.bottom + 16,
        },
      }}
    >
      {/* Header */}
      <Header
        title={isEdit ? 'Edit Service' : 'Add New Service'}
        subtitle={
          isEdit
            ? 'Update service details below'
            : 'Create a new service offering for your brand'
        }
      />

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
              returnKeyType="next"
              onSubmitEditing={() => form.setFocus('description')}
              {...field}
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
              maxLength={350}
              returnKeyType="next"
              onSubmitEditing={() => form.setFocus('durationMins')}
              {...field}
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
            <Select
              value={field.value}
              onChangeText={field.onChangeText as (value: SelectValue) => void}
              placeholder="Select duration"
              options={[
                { label: '30 min', value: '30' },
                { label: '60 min', value: '60' },
                { label: '90 min', value: '90' },
                { label: '120 min', value: '120' },
              ]}
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
              {...field}
              placeholder="80 000 so'm"
              thousandSeparator
              maxDecimals={0}
              returnKeyType="done"
            />
          )}
        />

        <FormField
          control={form.control}
          name="currency"
          label="Currency"
          required
          message="Select the currency for this service"
          render={({ field }) => (
            <Select
              value={field.value}
              onChangeText={field.onChangeText as (value: SelectValue) => void}
              placeholder="Select currency"
              options={[
                { label: 'So`m', value: 'UZS' },
                { label: 'Dollar', value: 'USD' },
                { label: 'Ruble', value: 'RUB' },
              ]}
            />
          )}
        />
      </View>

      {/* Action Buttons */}
      <View className="mt-12 gap-3">
        <Button
          size="lg"
          onPress={handleSubmit}
          disabled={
            !form.formState.isValid || isCreatingService || isUpdatingService
          }
        >
          {isCreatingService || isUpdatingService ? (
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
        {isEdit && (
          <Button
            onPress={handleDelete}
            variant="ghost"
            size="lg"
            disabled={isDeletingService}
            loading={isDeletingService}
          >
            <Text className="text-destructive font-title">Delete</Text>
          </Button>
        )}
      </View>
    </KeyboardAvoid>
  );
};

export default UpsertServiceScreen;
