import { ImagePickerSheet } from '@/components/shared/image-picker.sheet';
import { Button, Text } from '@/components/ui';
import Icons from '@/lib/icons';
import type { IWorker } from '@/types/worker.type';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import React, { Fragment, useRef, useState } from 'react';
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
  const [isAvatarPicker, setIsAvatarPicker] = useState(false);
  const [bannerUri, setBannerUri] = useState(worker.coverImage);

  const handleEditProfile = () => {
    setIsAvatarPicker(true);
    imagePickerRef.current?.present();
  };

  const handleEditBanner = () => {
    setIsAvatarPicker(false);
    imagePickerRef.current?.present();
  };

  const handleImageChange = (uri: string, type: 'avatar' | 'banner') => {
    if (type === 'avatar') {
      setAvatarUri(uri);
    } else {
      setBannerUri(uri);
    }
  };

  return (
    <Fragment>
      <View className="relative h-60 mb-4">
        {/* Cover Image */}
        {bannerUri && (
          <Image source={{ uri: bannerUri }} className="w-full h-full" />
        )}
        <Pressable
          onPress={handleEditBanner}
          className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-primary/60 items-center justify-center border border-card shadow-lg"
        >
          <Icons.Pencil size={16} className="text-primary-foreground" />
        </Pressable>
      </View>
      <View className="px-6 mb-8 -mt-16">
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
        <Button
          onPress={() =>
            router.push('/(slide-screens)/(worker)/edit-worker-profile')
          }
          className="bg-primary"
        >
          <View className="flex-row items-center gap-2">
            <Icons.Pencil size={18} className="text-primary-foreground" />
            <Text className="font-subtitle text-primary-foreground">
              Edit Profile
            </Text>
          </View>
        </Button>

        <ImagePickerSheet
          ref={imagePickerRef}
          onChange={(uri) =>
            handleImageChange(uri, isAvatarPicker ? 'avatar' : 'banner')
          }
          title={
            isAvatarPicker ? 'Change Profile Photo' : 'Change Banner Photo'
          }
        />
      </View>
    </Fragment>
  );
};
