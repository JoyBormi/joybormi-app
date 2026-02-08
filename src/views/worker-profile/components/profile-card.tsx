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
  photosCount: number;
  canEdit: boolean;
  onEdit: () => void;
  onEditAvatar: () => void;
  onEditBanner: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  worker,
  servicesCount,
  workDaysCount,
  photosCount,
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
          {/* Avatar + Identity */}
          <View className="items-center mb-4">
            <ProfileAvatar
              imageUri={worker.avatar}
              canEdit={canEdit}
              onEdit={onEditAvatar}
              containerClassName="mb-3 -mt-20"
              editButtonSize={40}
              editIconSize={18}
            />

            <Text className="font-title text-center text-foreground">
              {worker.username}
            </Text>

            {worker.jobTitle && (
              <Text className="font-subtitle text-muted-foreground mt-1">
                {worker.jobTitle}
              </Text>
            )}
          </View>

          {/* Quick Stats */}
          <View className="flex-row gap-3 mb-6">
            <View className="flex-1 bg-muted/20 rounded-2xl p-4 items-center">
              <Icons.Briefcase size={20} className="text-primary mb-2" />
              <Text className="font-heading text-foreground">
                {servicesCount}
              </Text>
              <Text className="font-caption text-muted-foreground">
                Services
              </Text>
            </View>

            <View className="flex-1 bg-muted/20 rounded-2xl p-4 items-center">
              <Icons.Calendar size={20} className="text-success mb-2" />
              <Text className="font-heading text-foreground">
                {workDaysCount}
              </Text>
              <Text className="font-caption text-muted-foreground">
                Work Days
              </Text>
            </View>

            <View className="flex-1 bg-muted/20 rounded-2xl p-4 items-center">
              <Icons.Star size={20} className="text-warning mb-2" />
              <Text className="font-heading text-foreground">
                {photosCount}
              </Text>
              <Text className="font-caption text-muted-foreground">Photos</Text>
            </View>
          </View>

          {/* Edit */}
          {canEdit && (
            <Button onPress={onEdit}>
              <Icons.Pencil size={16} className="text-primary-foreground" />
              <Text>Edit Profile</Text>
            </Button>
          )}
        </View>
      </View>
    </Fragment>
  );
};
