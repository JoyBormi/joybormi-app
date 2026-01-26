import React from 'react';
import { Pressable, View } from 'react-native';

import Icons from '@/components/icons';
import { Text } from '@/components/ui';

import type { IBrand } from '@/types/brand.type';

interface BrandPhotosGridProps {
  brand: IBrand;
  canEdit: boolean;
  onAddPhoto: () => void;
  onPhotoPress?: (photo: IBrand, index: number) => void;
}

/**
 * Brand Photos Grid Component
 * Displays grid of brand photos with add button
 */
export const BrandPhotosGrid: React.FC<BrandPhotosGridProps> = ({
  brand,
  canEdit,
  onAddPhoto,
  onPhotoPress,
}) => {
  return (
    <View className="px-6 mb-8">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="font-title text-lg text-foreground">
          Photos
          {/* ({brand.photos.length}) */}
        </Text>
        {canEdit && (
          <Pressable onPress={onAddPhoto}>
            <Icons.Plus size={20} className="text-primary" />
          </Pressable>
        )}
      </View>
      {/* <View className="flex-row flex-wrap gap-2">
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
      </View> */}
    </View>
  );
};
