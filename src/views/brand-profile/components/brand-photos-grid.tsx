import { Text } from '@/components/ui';
import Icons from '@/lib/icons';
import type { IBrandPhoto } from '@/types/brand.type';
import React from 'react';
import { Image, Pressable, View } from 'react-native';

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
  return (
    <View className="px-6 mb-8">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="font-title text-lg text-foreground">
          Photos ({photos.length})
        </Text>
        {canEdit && (
          <Pressable onPress={onAddPhoto}>
            <Icons.Plus size={20} className="text-primary" />
          </Pressable>
        )}
      </View>
      <View className="flex-row flex-wrap gap-2">
        {photos.map((photo, index) => (
          <Pressable
            key={photo.id}
            onPress={() => onPhotoPress?.(photo, index)}
            className="active:opacity-70 w-[31%] h-24 aspect-square"
          >
            <Image
              source={{ uri: photo.url }}
              className="w-full h-full rounded-xl"
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
};
