import { router } from 'expo-router';
import React, { useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
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

const brand = {
  id: '1',
  name: 'Egg Deurap Jamwon Station Branch',
  description:
    'Premium beauty salon offering professional hair styling, coloring, and treatment services. Our experienced team provides personalized care in a modern, relaxing environment.',
  category: 'Hair Salon',
  logo: 'https://picsum.photos/seed/brand-logo/200/200',
  coverImage: 'https://picsum.photos/seed/brand-cover/800/400',
  rating: 4.8,
  reviewCount: 968,
  location: {
    address: 'Seoul Seocho-gu Jamwon-dong 91-9',
    city: 'Seoul',
    coordinates: {
      lat: 37.5172,
      lng: 127.0119,
    },
  },
  contact: {
    phone: '+82 2-1234-5678',
    email: 'contact@eggdeurap.com',
    website: 'https://eggdeurap.com',
  },
  workingHours: [
    { day: 'Monday', isOpen: true, openTime: '10:00', closeTime: '20:00' },
    { day: 'Tuesday', isOpen: true, openTime: '10:00', closeTime: '20:00' },
    { day: 'Wednesday', isOpen: true, openTime: '10:00', closeTime: '20:00' },
    { day: 'Thursday', isOpen: true, openTime: '10:00', closeTime: '20:00' },
    { day: 'Friday', isOpen: true, openTime: '10:00', closeTime: '21:00' },
    { day: 'Saturday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
    { day: 'Sunday', isOpen: true, openTime: '09:00', closeTime: '19:00' },
  ],
  isOpen: true,
  verified: true,
  tags: [
    'Hair Salon',
    'Color Specialist',
    'Premium Service',
    'Reservation Required',
  ],
  priceRange: 'premium',
};

const EditBrandProfileScreen = (uuid: string) => {
  const insets = useSafeAreaInsets();
  const blockedSheetRef = useRef<BlockedSheetRef>(null);

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

  const isFormDirty = form.formState.isDirty;

  const handleSave = useCallback(() => {}, []);

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
          onPress={() => {}}
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

      <BlockedSheet
        ref={blockedSheetRef}
        onCancel={() => router.back()}
        onConfirm={() => blockedSheetRef.current?.hide()}
      />
    </KeyboardAvoid>
  );
};
export default EditBrandProfileScreen;
