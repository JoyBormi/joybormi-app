import { Text } from '@/components/ui';
import Icons from '@/lib/icons';
import React from 'react';
import { Pressable, View } from 'react-native';
import type { Worker } from '../worker-profile.d';

interface AboutSectionProps {
  worker: Worker;
  onEdit: () => void;
}

/**
 * About Section Component
 * Displays worker bio and specialties
 */
export const AboutSection: React.FC<AboutSectionProps> = ({
  worker,
  onEdit,
}) => {
  return (
    <View className="px-6 mb-8">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="font-title text-lg text-foreground">About Me</Text>
        <Pressable onPress={onEdit}>
          <Icons.Pencil size={18} className="text-primary" />
        </Pressable>
      </View>
      <View className="bg-card/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50">
        <Text className="font-body text-muted-foreground leading-6 mb-4">
          {worker.bio}
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {worker.specialties.map((specialty, index) => (
            <View key={index} className="bg-primary/10 px-3 py-2 rounded-full">
              <Text className="font-caption text-primary">{specialty}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
