import { router } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KeyboardAvoid } from '@/components/shared';
import FormField from '@/components/shared/form-field';
import { Header } from '@/components/shared/header';
import { Loading } from '@/components/status-screens';
import {
  Button,
  Input,
  NumberInput,
  PhoneInput,
  Select,
  Text,
  Textarea,
} from '@/components/ui';
import { useGetBrand, useUpdateBrand } from '@/hooks/brand';
import { toast } from '@/providers/toaster';

export interface BrandForm {
  brand_name: string;
  description: string;
  country: string;
  state: string;
  city: string;
  street: string;
  detailed_address: string;
  postal_code: string;
  email: string;
  phone: string;
  profile_image?: string;
  banner_image?: string;
}

const EditBrandProfileScreen = () => {
  const insets = useSafeAreaInsets();

  // Fetch brand data
  const { data: brand, isLoading } = useGetBrand();
  const { mutateAsync: updateBrand, isPending: isUpdating } = useUpdateBrand();

  // Form state matching backend schema
  const form = useForm<BrandForm>({
    defaultValues: {
      brand_name: '',
      description: '',
      country: '',
      state: '',
      city: '',
      street: '',
      detailed_address: '',
      postal_code: '',
      email: '',
      phone: '',
      profile_image: '',
      banner_image: '',
    },
  });

  // Update form when brand data loads
  useEffect(() => {
    if (brand) {
      form.reset({
        brand_name: brand.brandName,
        description: brand.description || '',
        country: brand.country,
        state: brand.state,
        city: brand.city,
        street: brand.street,
        detailed_address: brand.detailedAddress,
        postal_code: brand.postalCode,
        email: brand.email || '',
        phone: brand.phone,
        profile_image: brand.profileImage || '',
        banner_image: brand.bannerImage || '',
      });
    }
  }, [brand, form]);

  const isFormDirty = form.formState.isDirty;

  const handleSave = useCallback(async () => {
    if (!brand) return;

    const formData = form.getValues();
    const changedFields: Record<string, unknown> = {};

    // Only send changed fields
    Object.keys(formData).forEach((key) => {
      const formKey = key as keyof BrandForm;
      const brandKey =
        {
          brand_name: 'brandName',
          detailed_address: 'detailedAddress',
          postal_code: 'postalCode',
          profile_image: 'profileImage',
          banner_image: 'bannerImage',
        }[key] || key;

      if (form.formState.dirtyFields[formKey]) {
        changedFields[brandKey] = formData[formKey];
      }
    });

    await updateBrand({ brandId: brand.id, ...changedFields }).then(() => {
      toast.success({ title: 'Brand profile updated successfully!' });
      form.reset(formData);
      router.back();
    });
  }, [brand, form, updateBrand]);

  if (isLoading || !brand) return <Loading />;

  return (
    <KeyboardAvoid
      className="main-area"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: insets.bottom + 20,
        paddingTop: 12,
        rowGap: 24,
      }}
    >
      <Header
        title="Edit Brand"
        subtitle="Update your brand information"
        className="mb-4"
      />

      {/* Brand Name */}
      <FormField
        required
        control={form.control}
        name="brand_name"
        label="Brand Name"
        render={({ field }) => (
          <Input {...field} placeholder="Enter brand name" />
        )}
      />

      {/* Description */}
      <FormField
        required
        control={form.control}
        name="description"
        label="Description"
        className="min-h-[140px]"
        render={({ field }) => (
          <Textarea placeholder="Describe your brand..." {...field} />
        )}
      />

      {/* Contact Information */}
      <View className="gap-4 pt-2">
        <Text className="font-title text-lg text-foreground">
          Contact Information
        </Text>

        <FormField
          required
          control={form.control}
          name="email"
          label="Email"
          render={({ field }) => (
            <Input
              {...field}
              placeholder="email@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />

        <FormField
          required
          control={form.control}
          name="phone"
          label="Phone"
          render={({ field }) => (
            <PhoneInput {...field} placeholder="+998 94 945 25 40" />
          )}
        />
      </View>

      {/* Address */}
      <View className="gap-4 pt-2">
        <Text className="font-title text-lg text-foreground">Address</Text>

        <FormField
          required
          control={form.control}
          name="street"
          label="Street"
          render={({ field }) => (
            <Input
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholder="123 Main St"
            />
          )}
        />

        <FormField
          required
          control={form.control}
          name="detailed_address"
          label="Detailed Address"
          render={({ field }) => (
            <Input
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholder="Apt, Suite, Building, etc."
            />
          )}
        />

        <View className="flex-row gap-3">
          <FormField
            required
            control={form.control}
            name="country"
            label="Country"
            className="flex-1"
            render={({ field }) => (
              <Select
                options={[{ label: 'Uzbekistan', value: 'UZB' }]}
                {...field}
                placeholder="Country"
              />
            )}
          />
          <FormField
            required
            control={form.control}
            name="state"
            label="State"
            className="flex-1"
            render={({ field }) => (
              <Select
                options={[
                  { label: 'Tashkent', value: 'Toshkent' },
                  { label: 'Samarqand', value: 'Samarqand' },
                  { label: 'Bukhara', value: 'Bukhara' },
                ]}
                {...field}
                placeholder="State"
              />
            )}
          />
        </View>

        <View className="flex-row gap-3">
          <FormField
            required
            control={form.control}
            name="city"
            label="City"
            className="flex-1"
            render={({ field }) => <Input {...field} placeholder="City" />}
          />
          <FormField
            required
            control={form.control}
            name="postal_code"
            label="Postal Code"
            className="flex-1"
            render={({ field }) => (
              <NumberInput {...field} placeholder="12345" />
            )}
          />
        </View>
      </View>

      {/* Action Buttons */}
      <Button
        onPress={handleSave}
        disabled={!isFormDirty || isUpdating}
        loading={isUpdating}
        size="lg"
        className="self-end min-w-fit mt-4"
      >
        <Text>Save Changes</Text>
      </Button>
    </KeyboardAvoid>
  );
};
export default EditBrandProfileScreen;
