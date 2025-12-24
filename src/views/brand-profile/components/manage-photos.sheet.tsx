import { Button, Text } from '@/components/ui';
import Icons from '@/lib/icons';
import type { IBrandPhoto } from '@/types/brand.type';
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { Image, Pressable, View } from 'react-native';

interface ManagePhotosSheetProps {
  photos: IBrandPhoto[];
  onAddPhotos: (photos: string[]) => void;
  onDeletePhoto: (photoId: string) => void;
}

/**
 * Manage Photos Bottom Sheet
 * Allows adding and deleting brand photos
 */
export const ManagePhotosSheet = forwardRef<
  BottomSheetModal,
  ManagePhotosSheetProps
>(({ photos, onAddPhotos, onDeletePhoto }, ref) => {
  const snapPoints = useMemo(() => ['80%'], []);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  const handleClose = useCallback(() => {
    (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
    setSelectedPhotos([]);
  }, [ref]);

  const pickImages = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const uris = result.assets.map((asset) => asset.uri);
      setSelectedPhotos((prev) => [...prev, ...uris]);
    }
  }, []);

  const handleSave = useCallback(() => {
    if (selectedPhotos.length > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onAddPhotos(selectedPhotos);
    }
    handleClose();
  }, [selectedPhotos, onAddPhotos, handleClose]);

  const handleDelete = useCallback(
    (photoId: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onDeletePhoto(photoId);
    },
    [onDeletePhoto],
  );

  const removeSelectedPhoto = useCallback((uri: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPhotos((prev) => prev.filter((p) => p !== uri));
  }, []);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: 'transparent' }}
      handleIndicatorStyle={{ backgroundColor: '#666' }}
    >
      <BottomSheetView className="flex-1 bg-background">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-border">
          <Text className="font-heading text-xl text-foreground">
            Manage Photos
          </Text>
          <Pressable onPress={handleClose}>
            <Icons.X size={24} className="text-muted-foreground" />
          </Pressable>
        </View>

        <BottomSheetScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
        >
          <View className="p-6 gap-6">
            {/* Add Photos Button */}
            <Pressable
              onPress={pickImages}
              className="bg-primary/10 rounded-2xl p-6 border-2 border-dashed border-primary/30 items-center gap-3"
            >
              <View className="w-16 h-16 rounded-full bg-primary/20 items-center justify-center">
                <Icons.Plus size={32} className="text-primary" />
              </View>
              <View className="items-center">
                <Text className="font-subtitle text-foreground mb-1">
                  Add New Photos
                </Text>
                <Text className="font-caption text-muted-foreground">
                  Tap to select photos from your library
                </Text>
              </View>
            </Pressable>

            {/* Selected Photos (to be uploaded) */}
            {selectedPhotos.length > 0 && (
              <View>
                <Text className="font-title text-foreground mb-3">
                  New Photos ({selectedPhotos.length})
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {selectedPhotos.map((uri, index) => (
                    <View key={index} className="relative">
                      <Image
                        source={{ uri }}
                        className="w-[31%] h-24 rounded-xl"
                      />
                      <Pressable
                        onPress={() => removeSelectedPhoto(uri)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive items-center justify-center"
                      >
                        <Icons.X size={14} className="text-white" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Existing Photos */}
            {photos.length > 0 && (
              <View>
                <Text className="font-title text-foreground mb-3">
                  Current Photos ({photos.length})
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {photos.map((photo) => (
                    <View key={photo.id} className="relative">
                      <Image
                        source={{ uri: photo.url }}
                        className="w-[31%] h-24 rounded-xl"
                      />
                      <Pressable
                        onPress={() => handleDelete(photo.id)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive items-center justify-center"
                      >
                        <Icons.Trash2 size={14} className="text-white" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View className="gap-3 pb-6">
              {selectedPhotos.length > 0 && (
                <Button onPress={handleSave} className="bg-primary">
                  <View className="flex-row items-center gap-2">
                    <Icons.Upload
                      size={18}
                      className="text-primary-foreground"
                    />
                    <Text className="font-subtitle text-primary-foreground">
                      Upload {selectedPhotos.length} Photo
                      {selectedPhotos.length > 1 ? 's' : ''}
                    </Text>
                  </View>
                </Button>
              )}
              <Button
                onPress={handleClose}
                variant="outline"
                className="border-border"
              >
                <Text className="font-subtitle text-foreground">
                  {selectedPhotos.length > 0 ? 'Cancel' : 'Close'}
                </Text>
              </Button>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

ManagePhotosSheet.displayName = 'ManagePhotosSheet';
