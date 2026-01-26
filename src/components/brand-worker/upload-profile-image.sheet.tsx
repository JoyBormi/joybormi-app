import {
  BottomSheetModal,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import React, { forwardRef, useCallback, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icons from '@/components/icons';
import CustomBottomSheet from '@/components/shared/bottom-sheet';
import { Button, Text } from '@/components/ui';

interface UploadProfileImageSheetProps {
  currentImage?: string;
  onUpload: (uri: string) => void;
}

/**
 * Shared Upload Profile Image Sheet
 * Used by both Brand and Worker profiles
 */
export const UploadProfileImageSheet = forwardRef<
  BottomSheetModal,
  UploadProfileImageSheetProps
>(({ currentImage, onUpload }, ref) => {
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
      aspect: [1, 1],
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

  const displayImage = selectedImage || currentImage;

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
      <View className="gap-6 pb-8 pt-4 items-center">
        {/* Header */}
        <View className="flex-row items-center justify-between w-full">
          <Text className="font-heading text-xl text-foreground">
            Profile Image
          </Text>
          <Pressable onPress={handleClose}>
            <Icons.X size={24} className="text-muted-foreground" />
          </Pressable>
        </View>

        {/* Image Preview */}
        <Pressable
          onPress={pickImage}
          className="w-40 h-40 rounded-3xl bg-muted/20 border-2 border-dashed border-border overflow-hidden items-center justify-center"
        >
          {displayImage ? (
            <Image source={{ uri: displayImage }} className="w-full h-full" />
          ) : (
            <View className="items-center gap-3">
              <View className="w-16 h-16 rounded-full bg-primary/20 items-center justify-center">
                <Icons.Camera size={32} className="text-primary" />
              </View>
              <Text className="font-caption text-muted-foreground">
                Tap to upload
              </Text>
            </View>
          )}
        </Pressable>

        <Text className="font-caption text-muted-foreground text-center">
          Recommended: Square image (1:1 ratio)
        </Text>

        {/* Action Buttons */}
        <View className="gap-3 w-full">
          {selectedImage && (
            <Button onPress={handleUpload} className="bg-primary">
              <View className="flex-row items-center gap-2">
                <Icons.Upload size={18} className="text-primary-foreground" />
                <Text className="font-subtitle text-primary-foreground">
                  Save Profile Image
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
              <Icons.Camera size={18} className="text-foreground" />
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

UploadProfileImageSheet.displayName = 'UploadProfileImageSheet';
