import { IBrandPhoto } from '@/types/brand.type';
import { MotiView } from 'moti';
import React from 'react';
import { Image, Pressable, View } from 'react-native';

interface PhotoGridProps {
  photos: IBrandPhoto[];
  onPhotoPress?: (photo: IBrandPhoto, index: number) => void;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  onPhotoPress,
}) => {
  return (
    <View className="flex-row flex-wrap gap-2 px-4">
      {photos.map((photo, index) => (
        <MotiView
          key={photo.id}
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 300, delay: index * 50 }}
          className="w-[31%]"
        >
          <Pressable
            onPress={() => onPhotoPress?.(photo, index)}
            className="aspect-square rounded-xl overflow-hidden bg-muted border border-border/50"
          >
            <Image
              source={{ uri: photo.url }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </Pressable>
        </MotiView>
      ))}
    </View>
  );
};
