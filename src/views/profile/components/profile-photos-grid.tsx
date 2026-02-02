import { MotiView } from 'moti';
import React from 'react';
import { Image, Pressable, View } from 'react-native';

import Icons from '@/components/icons';
import { Text } from '@/components/ui';

interface ProfilePhotoItem {
  id: string;
  url: string;
}

interface ProfilePhotosGridProps<TPhoto extends ProfilePhotoItem> {
  photos: TPhoto[];
  canEdit: boolean;
  onAddPhoto: () => void;
  onPhotoPress?: (photo: TPhoto, index: number) => void;
  title?: string;
}

export const ProfilePhotosGrid = <TPhoto extends ProfilePhotoItem>({
  photos,
  canEdit,
  onAddPhoto,
  onPhotoPress,
  title = 'Photos',
}: ProfilePhotosGridProps<TPhoto>) => {
  if (photos.length === 0) return null;

  return (
    <View className="px-6 mb-8">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="font-title text-lg text-foreground">
          {title}
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
