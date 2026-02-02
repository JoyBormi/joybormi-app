import React from 'react';
import { Image, type ImageSourcePropType, Pressable, View } from 'react-native';

import Icons from '@/components/icons';
import { placeholder } from '@/constants/images';
import { cn } from '@/lib/utils';

interface ProfileCoverProps {
  imageUri?: string | null;
  placeholderImage?: ImageSourcePropType;
  canEdit?: boolean;
  onEdit?: () => void;
  containerClassName?: string;
  imageClassName?: string;
  editButtonClassName?: string;
}

export const ProfileCover: React.FC<ProfileCoverProps> = ({
  imageUri,
  placeholderImage,
  canEdit = false,
  onEdit,
  containerClassName,
  imageClassName,
  editButtonClassName,
}) => {
  const source = imageUri
    ? { uri: imageUri }
    : (placeholderImage ?? placeholder.banner);

  return (
    <View className={cn('relative h-60 mb-4', containerClassName)}>
      <Image
        source={source}
        className={cn('w-full h-full object-contain', imageClassName)}
      />
      {canEdit && onEdit && (
        <Pressable
          onPress={onEdit}
          className={cn(
            'absolute bottom-2 right-2 w-10 h-10 rounded-full bg-primary/60 items-center justify-center border border-card shadow-lg',
            editButtonClassName,
          )}
        >
          <Icons.Pencil size={16} className="text-primary-foreground" />
        </Pressable>
      )}
    </View>
  );
};
