import React, { Fragment } from 'react';
import { View } from 'react-native';

import Icons from '@/components/icons';
import { Button, Text } from '@/components/ui';
import { ProfileAvatar, ProfileCover } from '@/views/profile/components';

import type { IWorker } from '@/types/worker.type';

interface ProfileCardProps {
  worker: IWorker;
  servicesCount: number;
  workDaysCount: number;
  reviewsCount: number;
  canEdit: boolean;
  onEdit: () => void;
  onEditAvatar: () => void;
  onEditBanner: () => void;
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
  canEdit,
  onEdit,
  onEditAvatar,
  onEditBanner,
}) => {
  return (
    <Fragment>
      <ProfileCover
        imageUri={worker.coverImage ?? undefined}
        canEdit={canEdit}
        onEdit={onEditBanner}
      />
      <View className="main-area">
        <View className="bg-card/50 backdrop-blur-xl px-6 pb-6">
          {/* Avatar and Basic Info */}
          <View className="items-center mb-6">
            <ProfileAvatar
              imageUri={worker.avatar}
              canEdit={canEdit}
              onEdit={onEditAvatar}
              containerClassName="mb-4 -mt-20"
              editButtonSize={40}
              editIconSize={18}
            />

            <Text className="font-title text-center text-foreground mb-1">
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
                • {reviewsCount} reviews
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
              <Text className="font-caption text-muted-foreground">
                Services
              </Text>
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
              <Text className="font-caption text-muted-foreground">
                Reviews
              </Text>
            </View>
          </View>

          {/* Edit Profile Button */}
          {canEdit && (
            <Button onPress={onEdit} className="bg-primary">
              <View className="flex-row items-center gap-2">
                <Icons.Pencil size={18} className="text-primary-foreground" />
                <Text className="font-subtitle text-primary-foreground">
                  Edit Profile
                </Text>
              </View>
            </Button>
          )}
        </View>
      </View>
    </Fragment>
  );
};
