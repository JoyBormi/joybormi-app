import { CustomBottomSheet } from '@/components/shared';
import { Button, Input, Text, Textarea } from '@/components/ui';
import Icons from '@/lib/icons';
import type { IBrand } from '@/types/brand.type';
import {
  BottomSheetModal,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import React, { forwardRef, useCallback, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface BrandFormData {
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
  onSave: (data: BrandFormData) => void;
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
    const [formData, setFormData] = useState<BrandFormData>({
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
    });

    const handleClose = useCallback(() => {
      (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
    }, [ref]);

    const handleSave = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onSave(formData);
      handleClose();
    }, [formData, onSave, handleClose]);

    const pickImage = useCallback(
      async (type: 'profile_image' | 'banner_image') => {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: type === 'profile_image' ? [1, 1] : [16, 9],
          quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setFormData((prev) => ({
            ...prev,
            [type]: result.assets[0].uri,
          }));
        }
      },
      [],
    );

    return (
      <CustomBottomSheet
        ref={ref}
        index={0}
        scrollEnabled
        snapPoints={['90%', '99%']}
        animationConfigs={animationConfigs}
        scrollConfig={{
          contentContainerStyle: {
            paddingBottom: insets.bottom + 120,
          },
          showsVerticalScrollIndicator: false,
        }}
      >
        <View className="gap-6">
          {/* Banner Image */}
          <View>
            <Text className="font-subtitle text-foreground mb-2">
              Banner Image
            </Text>
            <Pressable
              onPress={() => pickImage('banner_image')}
              className="w-full h-40 rounded-2xl bg-muted/20 border-2 border-dashed border-border items-center justify-center overflow-hidden"
            >
              {formData.banner_image ? (
                <Image
                  source={{ uri: formData.banner_image }}
                  className="w-full h-full"
                />
              ) : (
                <View className="items-center gap-2">
                  <Icons.Image size={32} className="text-muted-foreground" />
                  <Text className="font-caption text-muted-foreground">
                    Tap to upload banner
                  </Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Profile Image */}
          <View>
            <Text className="font-subtitle text-foreground mb-2">
              Profile Image
            </Text>
            <Pressable
              onPress={() => pickImage('profile_image')}
              className="w-32 h-32 rounded-3xl bg-muted/20 border-2 border-dashed border-border items-center justify-center overflow-hidden"
            >
              {formData.profile_image ? (
                <Image
                  source={{ uri: formData.profile_image }}
                  className="w-full h-full"
                />
              ) : (
                <View className="items-center gap-2">
                  <Icons.Camera size={24} className="text-muted-foreground" />
                  <Text className="font-caption text-muted-foreground">
                    Upload
                  </Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Brand Name */}
          <View>
            <Text className="font-subtitle text-foreground mb-2">
              Brand Name *
            </Text>
            <Input
              value={formData.brand_name}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, brand_name: text }))
              }
              placeholder="Enter brand name"
              className="bg-card/50"
            />
          </View>

          {/* Description */}
          <View>
            <Text className="font-subtitle text-foreground mb-2">
              Description *
            </Text>
            <Textarea
              value={formData.description}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, description: text }))
              }
              placeholder="Describe your brand..."
              className="bg-card/50 min-h-[100px]"
            />
          </View>

          {/* Contact Information */}
          <View className="gap-4">
            <Text className="font-title text-lg text-foreground">
              Contact Information
            </Text>

            <View>
              <Text className="font-subtitle text-foreground mb-2">
                Email *
              </Text>
              <Input
                value={formData.email}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, email: text }))
                }
                placeholder="email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-card/50"
              />
            </View>

            <View>
              <Text className="font-subtitle text-foreground mb-2">
                Phone *
              </Text>
              <Input
                value={formData.phone}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, phone: text }))
                }
                placeholder="+1 (555) 000-0000"
                keyboardType="phone-pad"
                className="bg-card/50"
              />
            </View>
          </View>

          {/* Address Information */}
          <View className="gap-4">
            <Text className="font-title text-lg text-foreground">Address</Text>

            <View>
              <Text className="font-subtitle text-foreground mb-2">
                Street *
              </Text>
              <Input
                value={formData.street}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, street: text }))
                }
                placeholder="123 Main St"
                className="bg-card/50"
              />
            </View>

            <View>
              <Text className="font-subtitle text-foreground mb-2">
                Detailed Address
              </Text>
              <Input
                value={formData.detailed_address}
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    detailed_address: text,
                  }))
                }
                placeholder="Apt, Suite, Building, etc."
                className="bg-card/50"
              />
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="font-subtitle text-foreground mb-2">
                  City *
                </Text>
                <Input
                  value={formData.city}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, city: text }))
                  }
                  placeholder="City"
                  className="bg-card/50"
                />
              </View>

              <View className="flex-1">
                <Text className="font-subtitle text-foreground mb-2">
                  State *
                </Text>
                <Input
                  value={formData.state}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, state: text }))
                  }
                  placeholder="State"
                  className="bg-card/50"
                />
              </View>
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="font-subtitle text-foreground mb-2">
                  Postal Code *
                </Text>
                <Input
                  value={formData.postal_code}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, postal_code: text }))
                  }
                  placeholder="12345"
                  keyboardType="number-pad"
                  className="bg-card/50"
                />
              </View>

              <View className="flex-1">
                <Text className="font-subtitle text-foreground mb-2">
                  Country *
                </Text>
                <Input
                  value={formData.country}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, country: text }))
                  }
                  placeholder="Country"
                  className="bg-card/50"
                />
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-3 pb-6">
            <Button onPress={handleSave} className="bg-primary">
              <Text className="font-subtitle text-primary-foreground">
                Save Changes
              </Text>
            </Button>
            <Button
              onPress={handleClose}
              variant="outline"
              className="border-border"
            >
              <Text className="font-subtitle text-foreground">Cancel</Text>
            </Button>
          </View>
        </View>
      </CustomBottomSheet>
    );
  },
);

EditBrandSheet.displayName = 'EditBrandSheet';
