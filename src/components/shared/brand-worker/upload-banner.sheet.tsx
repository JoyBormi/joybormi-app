import CustomBottomSheet from '@/components/shared/bottom-sheet';
import { Button, Text } from '@/components/ui';
import Icons from '@/lib/icons';
import {
  BottomSheetModal,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import React, { forwardRef, useCallback, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface UploadBannerSheetProps {
  currentBanner?: string;
  onUpload: (uri: string) => void;
}

/**
 * Shared Upload Banner/Cover Image Sheet
 * Used by both Brand and Worker profiles
 */
export const UploadBannerSheet = forwardRef<
  BottomSheetModal,
  UploadBannerSheetProps
>(({ currentBanner, onUpload }, ref) => {
  const insets = useSafeAreaInsets();
  const animationConfigs = useBottomSheetTimingConfigs({ duration: 150 });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleClose = useCallback(() => {
    (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
    setSelectedImage(null);
  }, [ref]);

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSelectedImage(result.assets[0].uri);
    }
  }, []);

  const handleUpload = useCallback(() => {
    if (selectedImage) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onUpload(selectedImage);
      handleClose();
    }
  }, [selectedImage, onUpload, handleClose]);

  const displayImage = selectedImage || currentBanner;

  return (
    <CustomBottomSheet
      ref={ref}
      index={0}
      detached
      bottomInset={insets.bottom}
      animationConfigs={animationConfigs}
      style={{
        paddingHorizontal: 12,
      }}
      bottomSheetViewConfig={{
        className: 'rounded-b-3xl',
      }}
    >
      <View className="gap-6 pb-8 pt-4">
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <Text className="font-heading text-xl text-foreground">
            Banner Image
          </Text>
          <Pressable onPress={handleClose}>
            <Icons.X size={24} className="text-muted-foreground" />
          </Pressable>
        </View>

        {/* Image Preview */}
        <Pressable
          onPress={pickImage}
          className="w-full h-48 rounded-2xl bg-muted/20 border-2 border-dashed border-border overflow-hidden items-center justify-center"
        >
          {displayImage ? (
            <Image source={{ uri: displayImage }} className="w-full h-full" />
          ) : (
            <View className="items-center gap-3">
              <View className="w-16 h-16 rounded-full bg-primary/20 items-center justify-center">
                <Icons.Image size={32} className="text-primary" />
              </View>
              <View className="items-center">
                <Text className="font-subtitle text-foreground mb-1">
                  Upload Banner
                </Text>
                <Text className="font-caption text-muted-foreground">
                  Recommended: 16:9 aspect ratio
                </Text>
              </View>
            </View>
          )}
        </Pressable>

        {/* Action Buttons */}
        <View className="gap-3">
          {selectedImage && (
            <Button onPress={handleUpload} className="bg-primary">
              <View className="flex-row items-center gap-2">
                <Icons.Upload size={18} className="text-primary-foreground" />
                <Text className="font-subtitle text-primary-foreground">
                  Save Banner
                </Text>
              </View>
            </Button>
          )}
          <Button
            onPress={pickImage}
            variant="outline"
            className="border-border"
          >
            <View className="flex-row items-center gap-2">
              <Icons.Image size={18} className="text-foreground" />
              <Text className="font-subtitle text-foreground">
                {displayImage ? 'Change Image' : 'Select Image'}
              </Text>
            </View>
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
});

UploadBannerSheet.displayName = 'UploadBannerSheet';
