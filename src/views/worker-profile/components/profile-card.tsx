import { ImagePickerSheet } from '@/components/shared/image-picker.sheet';
import { Button, Text } from '@/components/ui';
import Icons from '@/lib/icons';
import type { IWorker } from '@/types/worker.type';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useRef, useState } from 'react';
import { Image, Pressable, View } from 'react-native';

interface ProfileCardProps {
  worker: IWorker;
  servicesCount: number;
  workDaysCount: number;
  reviewsCount: number;
  onEdit: () => void;
}

/**
 * Profile Card Component
 * Displays worker avatar, info, stats, and edit button
 */
export const ProfileCard: React.FC<ProfileCardProps> = ({
  worker,
  servicesCount,
  workDaysCount,
  reviewsCount,
  onEdit,
}) => {
  const imagePickerRef = useRef<BottomSheetModal>(null);
  const [avatarUri, setAvatarUri] = useState(worker.avatar);

  const handleEditProfile = () => {
    imagePickerRef.current?.present();
  };

  const handleImageChange = (uri: string) => {
    setAvatarUri(uri);
  };

  return (
    <View className="px-6 mb-8">
      <View className="bg-card/50 backdrop-blur-xl rounded-3xl p-6 border border-border/50">
        {/* Avatar and Basic Info */}
        <View className="items-center mb-6">
          <View className="relative mb-4">
            <Image
              source={{ uri: avatarUri }}
              className="w-24 h-24 rounded-3xl"
            />
            <Pressable
              onPress={handleEditProfile}
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
            <Text className="font-subtitle text-foreground">
              {worker.rating}
            </Text>
            <Text className="font-caption text-muted-foreground">
              • {worker.reviewCount} reviews
            </Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-muted/20 rounded-2xl p-4 items-center">
            <Icons.Briefcase size={20} className="text-primary mb-2" />
            <Text className="font-heading text-lg text-foreground">
              {servicesCount}
            </Text>
            <Text className="font-caption text-muted-foreground">Services</Text>
          </View>
          <View className="flex-1 bg-muted/20 rounded-2xl p-4 items-center">
            <Icons.Calendar size={20} className="text-success mb-2" />
            <Text className="font-heading text-lg text-foreground">
              {workDaysCount}
            </Text>
            <Text className="font-caption text-muted-foreground">
              Work Days
            </Text>
          </View>
          <View className="flex-1 bg-muted/20 rounded-2xl p-4 items-center">
            <Icons.Star size={20} className="text-warning mb-2" />
            <Text className="font-heading text-lg text-foreground">
              {reviewsCount}
            </Text>
            <Text className="font-caption text-muted-foreground">Reviews</Text>
          </View>
        </View>

        {/* Edit Profile Button */}
        <Button onPress={onEdit} className="bg-primary">
          <View className="flex-row items-center gap-2">
            <Icons.Pencil size={18} className="text-primary-foreground" />
            <Text className="font-subtitle text-primary-foreground">
              Edit Profile
            </Text>
          </View>
        </Button>
      </View>
      <ImagePickerSheet
        ref={imagePickerRef}
        onChange={handleImageChange}
        title="Change Profile Photo"
      />
    </View>
  );
};
