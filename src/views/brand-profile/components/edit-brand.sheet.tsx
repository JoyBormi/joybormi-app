import { CustomBottomSheet, KeyboardAvoid } from '@/components/shared';
import FormField from '@/components/shared/form-field';
import {
  Button,
  Input,
  NumberInput,
  PhoneInput,
  Text,
  Textarea,
} from '@/components/ui';
import type { IBrand } from '@/types/brand.type';
import {
  BottomSheetModal,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import React, { forwardRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

interface EditBrandSheetProps {
  brand: IBrand;
  onSave: (data: Brandform) => void;
}

/**
 * Edit Brand Bottom Sheet
 * Allows editing brand information matching backend schema
 */
export const EditBrandSheet = forwardRef<BottomSheetModal, EditBrandSheetProps>(
  ({ brand, onSave }, ref) => {
    const insets = useSafeAreaInsets();
    const animationConfigs = useBottomSheetTimingConfigs({
      duration: 150,
    });

    // Form state matching backend schema
    const form = useForm<Brandform>({
      defaultValues: {
        brand_name: brand.name,
        description: brand.description,
        country: brand.location.address.split(',')[2]?.trim() || '',
        state: brand.location.address.split(',')[1]?.trim() || '',
        city: brand.location.city,
        street: brand.location.address.split(',')[0]?.trim() || '',
        detailed_address: brand.location.address,
        postal_code: '',
        email: brand.contact.email,
        phone: brand.contact.phone,
        profile_image: brand.logo,
        banner_image: brand.coverImage,
      },
    });

    const handleClose = useCallback(() => {
      (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
    }, [ref]);

    const handleSave = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onSave(form.getValues());
      handleClose();
    }, [form, onSave, handleClose]);

    return (
      <CustomBottomSheet
        ref={ref}
        index={0}
        scrollEnabled
        snapPoints={['90%', '99%']}
        animationConfigs={animationConfigs}
        // scrollConfig={{
        //   contentContainerStyle: {
        //     paddingBottom: insets.bottom + 120,
        //     gap: 12,
        //   },
        //   showsVerticalScrollIndicator: false,
        // }}
      >
        <KeyboardAvoid
          scrollConfig={{
            scrollEnabled: false,
            contentContainerStyle: {
              paddingBottom: insets.bottom + 120,
              gap: 12,
            },
          }}
        >
          <Text className="font-heading border-b pb-4 border-border text-foreground mb-2">
            Edit Brand
          </Text>
          {/* Brand Name */}
          <FormField
            required
            control={form.control}
            name="brand_name"
            label="Brand Name"
            render={({ field }) => (
              <Input
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="Enter brand name"
              />
            )}
          />

          {/* Description */}
          <FormField
            required
            control={form.control}
            name="description"
            label="Description"
            render={({ field }) => (
              <Textarea
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder="Describe your brand..."
              />
            )}
          />

          {/* Contact Information */}
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
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
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
              <PhoneInput
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="+998 94 945 25 40"
              />
            )}
          />

          {/* Address Information */}
          <View className="gap-4">
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
                render={({ field }) => (
                  <Input
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="City"
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
                  <Input
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="State"
                  />
                )}
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
                  <NumberInput
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="12345"
                  />
                )}
              />

              <FormField
                required
                control={form.control}
                name="country"
                label="Country"
                className="flex-1"
                render={({ field }) => (
                  <Input
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Country"
                  />
                )}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View className="mt-6 gap-4 flex-row">
            <Button
              onPress={handleClose}
              variant="outline"
              size="action"
              className="flex-[0.3] border-destructive"
            >
              <Text className="text-destructive">Delete</Text>
            </Button>

            <Button
              onPress={handleSave}
              disabled={!form.formState.isValid}
              size="action"
              className="flex-[0.7]"
            >
              <Text>Save Changes</Text>
            </Button>
          </View>
        </KeyboardAvoid>
      </CustomBottomSheet>
    );
  },
);

EditBrandSheet.displayName = 'EditBrandSheet';
