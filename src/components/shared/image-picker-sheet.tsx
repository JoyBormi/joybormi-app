import CustomBottomSheet from '@/components/shared/bottom-sheet';
import { Text } from '@/components/ui';
import Icons from '@/lib/icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import React, { forwardRef } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ImagePickerSheetProps {
  onChange: (uri: string) => void;
  title?: string;
}

/**
 * Image Picker Bottom Sheet Component
 * Displays options to pick image from camera or gallery
 */
export const ImagePickerSheet = forwardRef<
  BottomSheetModal,
  ImagePickerSheetProps
>(({ onChange, title = 'Select Image' }, ref) => {
  const insets = useSafeAreaInsets();

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera permission is required to take photos.',
      );
      return false;
    }
    return true;
  };

  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Gallery permission is required to select photos.',
      );
      return false;
    }
    return true;
  };

  const handleCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0].uri);
      if (ref && 'current' in ref) {
        ref.current?.dismiss();
      }
    }
  };

  const handleGallery = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0].uri);
      if (ref && 'current' in ref) {
        ref.current?.dismiss();
      }
    }
  };

  return (
    <CustomBottomSheet
      ref={ref}
      index={0}
      snapPoints={['35%']}
      bottomSheetViewConfig={{
        style: {
          paddingBottom: insets.bottom + 20,
        },
      }}
    >
      <View className="mb-6">
        <Text className="font-heading text-xl text-foreground">{title}</Text>
        <Text className="font-body text-muted-foreground mt-1">
          Choose a source
        </Text>
      </View>

      <View className="gap-3">
        <Pressable
          onPress={handleCamera}
          className="flex-row items-center gap-4 p-5 rounded-2xl bg-card/50 border border-border/50 active:bg-muted/40"
        >
          <View className="w-12 h-12 rounded-xl bg-primary/10 items-center justify-center">
            <Icons.Camera size={24} className="text-primary" />
          </View>
          <View className="flex-1">
            <Text className="font-subtitle text-foreground">Take Photo</Text>
            <Text className="font-caption text-muted-foreground">
              Use your camera
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={handleGallery}
          className="flex-row items-center gap-4 p-5 rounded-2xl bg-card/50 border border-border/50 active:bg-muted/40"
        >
          <View className="w-12 h-12 rounded-xl bg-success/10 items-center justify-center">
            <Icons.Image size={24} className="text-success" />
          </View>
          <View className="flex-1">
            <Text className="font-subtitle text-foreground">
              Choose from Gallery
            </Text>
            <Text className="font-caption text-muted-foreground">
              Select from your photos
            </Text>
          </View>
        </Pressable>
      </View>
    </CustomBottomSheet>
  );
});

ImagePickerSheet.displayName = 'ImagePickerSheet';
