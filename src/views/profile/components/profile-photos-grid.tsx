import { MotiView } from 'moti';
import React from 'react';
import { Image, Pressable, useWindowDimensions, View } from 'react-native';

import Icons from '@/components/icons';
import { Text } from '@/components/ui';
import { IFile } from '@/types/file.type';

interface ProfilePhotosGridProps {
  photos: IFile[];
  canEdit: boolean;
  onAddPhoto: () => void;
  onPhotoPress?: (photo: IFile, index: number) => void;
  title?: string;
}

const NUM_COLUMNS = 3;
const SPACING = 8;

export const ProfilePhotosGrid = ({
  photos,
  canEdit,
  onAddPhoto,
  onPhotoPress,
  title = 'Photos',
}: ProfilePhotosGridProps) => {
  const { width } = useWindowDimensions();

  const itemSize =
    (width - 48 /* screen padding */ - SPACING * (NUM_COLUMNS - 1)) /
    NUM_COLUMNS;

  if (photos.length === 0) return null;

  return (
    <View className="px-6 mb-8">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="font-title text-lg text-foreground">
          {title} ({photos.length})
        </Text>

        {canEdit && (
          <Pressable onPress={onAddPhoto} hitSlop={8}>
            <Icons.Plus size={20} className="text-primary" />
          </Pressable>
        )}
      </View>

      {/* Grid */}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginHorizontal: -SPACING / 2,
        }}
      >
        {photos.map((photo, index) => (
          <MotiView
            key={photo.id}
            from={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'timing',
              duration: 220,
              delay: index * 40,
            }}
            style={{
              width: itemSize,
              height: itemSize,
              margin: SPACING / 2,
            }}
          >
            <Pressable
              onPress={() => onPhotoPress?.(photo, index)}
              className="active:opacity-80 w-full h-full"
            >
              <Image
                source={{ uri: photo.url }}
                resizeMode="cover"
                className="w-full h-full rounded-xl bg-muted"
              />
            </Pressable>
          </MotiView>
        ))}
      </View>
    </View>
  );
};
