import { Text } from '@/components/ui';
import Icons from '@/lib/icons';
import { MotiView } from 'moti';
import React from 'react';
import { View } from 'react-native';

interface MemberAboutTabProps {
  member: {
    bio: string;
    specialties: string[];
    email?: string;
    phone?: string;
  };
  isOwner: boolean;
}

export const MemberAboutTab: React.FC<MemberAboutTabProps> = ({
  member,
  isOwner,
}) => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300 }}
      className="px-4"
    >
      {/* Bio */}
      <View className="mb-4">
        <Text className="font-title text-foreground mb-2">Bio</Text>
        <Text className="font-body text-muted-foreground leading-6">
          {member.bio}
        </Text>
      </View>

      {/* Specialties */}
      <View className="mb-4">
        <Text className="font-title text-foreground mb-2">Specialties</Text>
        <View className="flex-row flex-wrap gap-2">
          {member.specialties.map((specialty, index) => (
            <View key={index} className="bg-muted/50 px-3 py-1.5 rounded-full">
              <Text className="font-caption text-muted-foreground">
                {specialty}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Contact - Only visible to owner */}
      {isOwner && (member.email || member.phone) && (
        <View className="mb-4">
          <Text className="font-title text-foreground mb-2">Contact</Text>
          <View className="gap-3">
            {member.email && (
              <View className="flex-row items-center gap-3">
                <Icons.Mail size={20} className="text-muted-foreground" />
                <Text className="font-body text-foreground">
                  {member.email}
                </Text>
              </View>
            )}
            {member.phone && (
              <View className="flex-row items-center gap-3">
                <Icons.Phone size={20} className="text-muted-foreground" />
                <Text className="font-body text-foreground">
                  {member.phone}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </MotiView>
  );
};
