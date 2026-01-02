import { router } from 'expo-router';
import { RefreshCcw } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KeyboardAvoid } from '@/components/shared';
import { BlockedSheet, BlockedSheetRef } from '@/components/shared/block-sheet';
import FormField from '@/components/shared/form-field';
import { Header } from '@/components/shared/header';
import {
  Button,
  Input,
  NumberInput,
  PhoneInput,
  Text,
  Textarea,
} from '@/components/ui';
import { useDeleteBrand, useGetBrand, useUpdateBrand } from '@/hooks/brand';
import { useUserStore } from '@/stores';

export interface Brandform {
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
  const blockedSheetRef = useRef<BlockedSheetRef>(null);
  const { user } = useUserStore();

  // Fetch brand data
  const { data: brand, isLoading } = useGetBrand({ userId: user?.id });
  const { mutate: updateBrand, isPending: isUpdating } = useUpdateBrand(
    brand?.id || '',
  );
  const { mutate: deleteBrand, isPending: isDeleting } = useDeleteBrand();

  // Form state matching backend schema
  const form = useForm<Brandform>({
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

  const handleSave = useCallback(() => {
    if (!brand) return;

    const formData = form.getValues();
    const changedFields: Record<string, unknown> = {};

    // Only send changed fields
    Object.keys(formData).forEach((key) => {
      const formKey = key as keyof Brandform;
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

    if (Object.keys(changedFields).length === 0) {
      Alert.alert('No Changes', 'No changes were made to save.');
      return;
    }

    updateBrand(changedFields, {
      onSuccess: () => {
        Alert.alert('Success', 'Brand profile updated successfully!');
        form.reset(formData);
        router.back();
      },
      onError: (error) => {
        Alert.alert('Error', error.message || 'Failed to update brand profile');
      },
    });
  }, [brand, form, updateBrand]);

  const handleDelete = useCallback(() => {
    if (!brand) return;

    Alert.alert(
      'Delete Brand',
      'Are you sure you want to delete your brand? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteBrand(brand.id, {
              onSuccess: () => {
                Alert.alert('Success', 'Brand deleted successfully');
                router.replace('/(tabs)/(brand)/brand-profile');
              },
              onError: (error) => {
                Alert.alert('Error', error.message || 'Failed to delete brand');
              },
            });
          },
        },
      ],
    );
  }, [brand, deleteBrand]);

  if (isLoading || !brand) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <RefreshCcw size={32} className="text-primary animate-spin" />
      </View>
    );
  }

  return (
    <KeyboardAvoid
      className="bg-background px-4"
      scrollConfig={{
        showsVerticalScrollIndicator: false,
        contentContainerStyle: {
          paddingBottom: insets.bottom + 80,
          paddingTop: 12,
          rowGap: 24,
        },
      }}
    >
      <Header
        title="Edit Brand"
        subtitle="Update your brand information"
        className="mb-4"
        onGoBack={() => {
          if (isFormDirty) {
            blockedSheetRef.current?.show();
          } else {
            router.back();
          }
        }}
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
            name="city"
            label="City"
            className="flex-1"
            render={({ field }) => <Input {...field} placeholder="City" />}
          />

          <FormField
            required
            control={form.control}
            name="state"
            label="State"
            className="flex-1"
            render={({ field }) => <Input {...field} placeholder="State" />}
          />
        </View>

        <View className="flex-row gap-3">
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

          <FormField
            required
            control={form.control}
            name="country"
            label="Country"
            className="flex-1"
            render={({ field }) => <Input {...field} placeholder="Country" />}
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View className="mt-4 gap-4 flex-row">
        <Button
          onPress={handleDelete}
          variant="outline"
          size="action"
          className="flex-[0.3] border-destructive"
          disabled={isDeleting}
        >
          <Text className="text-destructive">Delete</Text>
        </Button>

        <Button
          onPress={handleSave}
          disabled={!isFormDirty || isUpdating}
          size="action"
          className="flex-[0.7]"
        >
          {isUpdating ? (
            <RefreshCcw
              size={20}
              className="text-primary-foreground animate-spin"
            />
          ) : (
            <Text>Save Changes</Text>
          )}
        </Button>
      </View>

      <BlockedSheet
        ref={blockedSheetRef}
        onCancel={() => router.back()}
        onConfirm={() => blockedSheetRef.current?.hide()}
      />
    </KeyboardAvoid>
  );
};
export default EditBrandProfileScreen;
