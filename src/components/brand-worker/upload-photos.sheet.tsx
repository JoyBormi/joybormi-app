import {
  BottomSheetModal,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import React, { forwardRef, useCallback, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CustomBottomSheet from '@/components/shared/bottom-sheet';
import { Button, Text } from '@/components/ui';
import Icons from '@/lib/icons';
import { cn } from '@/lib/utils';

type PhotoCategory = 'interior' | 'exterior' | 'service' | 'team' | 'other';

interface UploadPhotosSheetProps {
  onUpload: (photos: { uri: string; category: PhotoCategory }[]) => void;
}

/**
 * Shared Upload Photos Sheet
 * Used by both Brand and Worker profiles
 */
export const UploadPhotosSheet = forwardRef<
  BottomSheetModal,
  UploadPhotosSheetProps
>(({ onUpload }, ref) => {
  const insets = useSafeAreaInsets();
  const animationConfigs = useBottomSheetTimingConfigs({ duration: 150 });

  const [selectedPhotos, setSelectedPhotos] = useState<
    { uri: string; category: PhotoCategory }[]
  >([]);
  const [selectedCategory, setSelectedCategory] =
    useState<PhotoCategory>('other');

  const categories: { value: PhotoCategory; label: string; icon: string }[] = [
    { value: 'interior', label: 'Interior', icon: 'Home' },
    { value: 'exterior', label: 'Exterior', icon: 'Store' },
    { value: 'service', label: 'Service', icon: 'Scissors' },
    { value: 'team', label: 'Team', icon: 'Users' },
    { value: 'other', label: 'Other', icon: 'Image' },
  ];

  const handleClose = useCallback(() => {
    (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
    setSelectedPhotos([]);
    setSelectedCategory('other');
  }, [ref]);

  const pickImages = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const newPhotos = result.assets.map((asset) => ({
        uri: asset.uri,
        category: selectedCategory,
      }));
      setSelectedPhotos((prev) => [...prev, ...newPhotos]);
    }
  }, [selectedCategory]);

  const removePhoto = useCallback((index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleUpload = useCallback(() => {
    if (selectedPhotos.length > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onUpload(selectedPhotos);
      handleClose();
    }
  }, [selectedPhotos, onUpload, handleClose]);

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
      <View className="gap-6 pt-4">
        {/* Header */}
        <Text className="font-heading text-foreground">Upload Photos</Text>

        {/* Category Selection */}
        <View>
          <View className="flex-row flex-wrap gap-2">
            {categories.map((cat) => {
              const Icon = Icons[
                cat.icon as keyof typeof Icons
              ] as React.ComponentType<{ size: number; className: string }>;
              const isSelected = selectedCategory === cat.value;
              return (
                <Pressable
                  key={cat.value}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedCategory(cat.value);
                  }}
                  className={cn(
                    `flex-row items-center gap-2 px-2.5 py-1.5 rounded-xl border`,
                    {
                      'bg-primary/10 border-primary': isSelected,
                      'bg-card/50 border-border/50': !isSelected,
                    },
                  )}
                >
                  <Icon
                    size={18}
                    className={cn(
                      'text-muted-foreground',
                      isSelected ? 'text-primary' : 'text-muted-foreground',
                    )}
                  />
                  <Text
                    className={cn(
                      'font-subtitle',
                      isSelected ? 'text-primary' : 'text-foreground',
                    )}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

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
              Select Photos
            </Text>
            <Text className="font-caption text-muted-foreground">
              Category:{' '}
              {categories.find((c) => c.value === selectedCategory)?.label}
            </Text>
          </View>
        </Pressable>

        {/* Selected Photos */}
        {selectedPhotos.length > 0 && (
          <View>
            <Text className="font-title text-foreground mb-3">
              Selected Photos ({selectedPhotos.length})
            </Text>
            <View className="flex-row flex-wrap justify-start items-center gap-2">
              {selectedPhotos.map((photo, index) => (
                <View
                  key={index}
                  className="relative w-[31%] h-24 aspect-square"
                >
                  <Image
                    source={{ uri: photo.uri }}
                    className="h-full w-full rounded-xl"
                  />
                  <View className="absolute top-1 left-1 bg-black/60 px-2 py-1 rounded">
                    <Text className="font-caption text-white text-xs">
                      {
                        categories.find((c) => c.value === photo.category)
                          ?.label
                      }
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => removePhoto(index)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive items-center justify-center"
                  >
                    <Icons.X size={14} className="text-white" />
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View className="gap-3">
          {selectedPhotos.length > 0 && (
            <Button onPress={handleUpload} className="bg-primary">
              <View className="flex-row items-center gap-2">
                <Icons.Upload size={18} className="text-primary-foreground" />
                <Text className="font-subtitle text-primary-foreground">
                  Upload {selectedPhotos.length} Photo
                  {selectedPhotos.length > 1 ? 's' : ''}
                </Text>
              </View>
            </Button>
          )}
        </View>
      </View>
    </CustomBottomSheet>
  );
});

UploadPhotosSheet.displayName = 'UploadPhotosSheet';
