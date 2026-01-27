import { MotiView } from 'moti';
import React from 'react';
import { Image, Pressable, View } from 'react-native';

import Icons from '@/components/icons';
import { NoData } from '@/components/status-screens';
import { Text } from '@/components/ui';

import type { IBrandPhoto } from '@/types/brand.type';

interface BrandPhotosGridProps {
  photos: IBrandPhoto[];
  canEdit: boolean;
  onAddPhoto: () => void;
  onPhotoPress?: (photo: IBrandPhoto, index: number) => void;
}

/**
 * Brand Photos Grid Component
 * Displays grid of brand photos with add button
 */
export const BrandPhotosGrid: React.FC<BrandPhotosGridProps> = ({
  photos,
  canEdit,
  onAddPhoto,
  onPhotoPress,
}) => {
  if (photos.length === 0) {
    return (
      <NoData
        title="No Photos"
        message="Upload photos to showcase your brand."
        action={
          canEdit
            ? {
                label: 'Add Photos',
                onPress: onAddPhoto,
              }
            : undefined
        }
      />
    );
  }

  return (
    <View className="px-6 mb-8">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="font-title text-lg text-foreground">
          Photos
          {photos.length > 0 ? ` (${photos.length})` : ''}
        </Text>
        {canEdit && (
          <Pressable onPress={onAddPhoto}>
            <Icons.Plus size={20} className="text-primary" />
          </Pressable>
        )}
      </View>
      <View className="flex-row flex-wrap gap-2">
        {photos.map((photo, index) => (
          <MotiView
            key={photo.id}
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 250, delay: index * 40 }}
            className="w-[31%]"
          >
            <Pressable
              onPress={() => onPhotoPress?.(photo, index)}
              className="active:opacity-70 w-full h-24 aspect-square"
            >
              <Image
                source={{ uri: photo.url }}
                className="w-full h-full rounded-xl"
              />
            </Pressable>
          </MotiView>
        ))}
      </View>
    </View>
  );
};
