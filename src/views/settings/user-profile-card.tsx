import { Feedback } from '@/lib/haptics';
import Icons from '@/lib/icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { UserProfile, UserType } from './types';

interface Props {
  profile: UserProfile;
  onPress?: () => void;
}

const getUserTypeLabel = (type: UserType): string => {
  switch (type) {
    case 'user':
      return 'User';
    case 'creator':
      return 'Creator';
    case 'worker':
      return 'Worker';
  }
};

export const UserProfileCard: React.FC<Props> = ({ profile, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        Feedback.light();
        onPress?.();
      }}
      className="bg-card/50 backdrop-blur-sm rounded-2xl p-4 flex-row items-center gap-4"
    >
      {/* Avatar */}
      <View className="relative">
        {profile.avatar ? (
          <Image
            source={{ uri: profile.avatar }}
            className="w-16 h-16 rounded-2xl"
          />
        ) : (
          <View className="w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center">
            <Icons.User className="w-8 h-8 text-primary" />
          </View>
        )}
      </View>

      {/* Info */}
      <View className="flex-1">
        <Text className="text-xl text-foreground font-heading tracking-tight">
          {profile.name}
        </Text>
        <Text className="text-sm text-muted-foreground font-body mt-1">
          {profile.email}
        </Text>
      </View>

      {/* Chevron */}
      <Icons.ChevronRight className="text-muted-foreground w-5 h-5" />
    </TouchableOpacity>
  );
};
