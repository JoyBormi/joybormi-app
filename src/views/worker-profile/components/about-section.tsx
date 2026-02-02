import React from 'react';
import { Pressable, View } from 'react-native';

import Icons from '@/components/icons';
import { Text } from '@/components/ui';

import type { IWorker } from '@/types/worker.type';

interface AboutSectionDisplayProps {
  worker: IWorker;
  onEdit?: () => void;
  canEdit?: boolean;
}

/**
 * About Section Display Component
 * Displays worker bio and specialties
 */
export const AboutSectionDisplay: React.FC<AboutSectionDisplayProps> = ({
  worker,
  onEdit,
  canEdit = true,
}) => {
  return (
    <View className="px-6 mb-8">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="font-title text-lg text-foreground">About Me</Text>
        {canEdit && onEdit && (
          <Pressable onPress={onEdit}>
            <Icons.Pencil size={18} className="text-primary" />
          </Pressable>
        )}
      </View>
      <View className="bg-card/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50">
        <Text className="font-body text-muted-foreground leading-6 mb-4">
          {worker.bio || 'Tell clients about your experience and style.'}
        </Text>
        {worker.specialties.length > 0 ? (
          <View className="flex-row flex-wrap gap-2">
            {worker.specialties.map((specialty) => (
              <View
                key={specialty}
                className="bg-primary/10 px-3 py-2 rounded-full"
              >
                <Text className="font-caption text-primary">{specialty}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text className="font-caption text-muted-foreground">
            Add specialties so clients know what you do best.
          </Text>
        )}
      </View>
    </View>
  );
};
