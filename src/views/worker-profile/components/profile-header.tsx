import { Text } from '@/components/ui';
import Icons from '@/lib/icons';
import React from 'react';
import { Image, Pressable, View } from 'react-native';
import type { Worker } from '../worker-profile.d';

interface ProfileHeaderProps {
  worker: Worker;
  onEdit: () => void;
}

/**
 * Profile Header Component
 * Displays worker avatar, name, role, and rating
 */
export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  worker,
  onEdit,
}) => {
  return (
    <View className="items-center mb-6">
      <View className="relative mb-4">
        <Image
          source={{ uri: worker.avatar }}
          className="w-24 h-24 rounded-3xl"
        />
        <Pressable
          onPress={onEdit}
          className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary items-center justify-center border-2 border-card"
        >
          <Icons.Pencil size={18} className="text-primary-foreground" />
        </Pressable>
      </View>

      <Text className="font-heading text-2xl text-foreground mb-1">
        {worker.name}
      </Text>
      <Text className="font-subtitle text-muted-foreground mb-3">
        {worker.role}
      </Text>

      {/* Rating Badge */}
      <View className="flex-row items-center gap-2 bg-warning/10 px-4 py-2 rounded-full">
        <Icons.Star size={16} className="text-warning" fill="#f59e0b" />
        <Text className="font-subtitle text-foreground">{worker.rating}</Text>
        <Text className="font-caption text-muted-foreground">
          • {worker.reviewCount} reviews
        </Text>
      </View>
    </View>
  );
};
