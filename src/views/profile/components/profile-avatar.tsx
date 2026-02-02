import React from 'react';
import { Image, type ImageSourcePropType, Pressable, View } from 'react-native';

import Icons from '@/components/icons';
import { placeholder } from '@/constants/images';
import { cn } from '@/lib/utils';

interface ProfileAvatarProps {
  imageUri?: string | null;
  placeholderImage?: ImageSourcePropType;
  size?: number;
  canEdit?: boolean;
  onEdit?: () => void;
  containerClassName?: string;
  imageClassName?: string;
  editButtonSize?: number;
  editIconSize?: number;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  imageUri,
  placeholderImage,
  size = 128,
  canEdit = false,
  onEdit,
  containerClassName,
  imageClassName,
  editButtonSize = 48,
  editIconSize,
}) => {
  const source = imageUri
    ? { uri: imageUri }
    : (placeholderImage ?? placeholder.avatar);
  const iconSize =
    editIconSize ?? Math.max(16, Math.round(editButtonSize * 0.4));

  return (
    <View
      className={cn('relative', containerClassName)}
      style={{ width: size, height: size }}
    >
      <Image
        source={source}
        className={cn('rounded-3xl border-4 border-card', imageClassName)}
        style={{ width: size, height: size }}
      />
      {canEdit && onEdit && (
        <Pressable
          onPress={onEdit}
          className="absolute -bottom-2 -right-2 rounded-full bg-primary/60 items-center justify-center border-2 border-card shadow-lg"
          style={{ width: editButtonSize, height: editButtonSize }}
        >
          <Icons.Pencil size={iconSize} className="text-primary-foreground" />
        </Pressable>
      )}
    </View>
  );
};
