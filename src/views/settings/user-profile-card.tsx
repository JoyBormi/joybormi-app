import { Feedback } from '@/lib/haptics';
import Icons from '@/lib/icons';
import { IUser } from '@/types/user.type';
import { formatPhoneNumber } from '@/utils/helpers';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  profile: IUser | null;
  onPress?: () => void;
}

export const UserProfileCard: React.FC<Props> = ({ profile, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        Feedback.light();
        onPress?.();
      }}
      className="bg-card/50 backdrop-blur-sm rounded-2xl px-4 py-3 flex-row items-center gap-4 mb-8"
    >
      {/* Avatar */}
      <View className="relative">
        {profile?.image ? (
          <Image
            source={{ uri: profile.image }}
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
        <Text className="text-foreground font-title tracking-tight">
          {profile?.username ?? 'Hello, Guest 👋'}
        </Text>
        <Text className="text-muted-foreground font-body mt-1">
          {formatPhoneNumber(profile?.phone ?? '') ??
            profile?.email ??
            'Please login'}
        </Text>
      </View>

      {/* Chevron */}
      <Icons.ChevronRight className="text-muted-foreground w-5 h-5" />
    </TouchableOpacity>
  );
};
