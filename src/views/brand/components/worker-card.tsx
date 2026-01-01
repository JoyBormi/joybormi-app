import { MotiView } from 'moti';
import React from 'react';
import { Image, Pressable, View } from 'react-native';

import { Text } from '@/components/ui';
import Icons from '@/lib/icons';
import { IBrandWorker } from '@/types/brand.type';

interface WorkerCardProps {
  worker: IBrandWorker;
  onPress?: () => void;
  index?: number;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({
  worker,
  onPress,
  index = 0,
}) => {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 400, delay: index * 100 }}
    >
      <Pressable
        onPress={onPress}
        className="bg-card/30 backdrop-blur-sm rounded-2xl p-4 border border-border/50 mr-3 w-44"
      >
        {/* Avatar */}
        <View className="items-center mb-3">
          <View className="relative">
            <Image
              source={{ uri: worker.avatar }}
              className="w-20 h-20 rounded-full border-2 border-border"
              resizeMode="cover"
            />
            <View
              className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-card ${worker.isAvailable ? 'bg-success' : 'bg-muted'}`}
            />
          </View>
        </View>

        {/* Worker Info */}
        <Text
          className="font-subtitle text-foreground text-center mb-1"
          numberOfLines={1}
        >
          {worker.name}
        </Text>
        <Text
          className="font-caption text-muted-foreground text-center mb-2"
          numberOfLines={1}
        >
          {worker.role}
        </Text>

        {/* Rating */}
        <View className="flex-row items-center justify-center gap-1 mb-2">
          <Icons.Star size={14} className="text-warning fill-warning" />
          <Text className="font-caption text-foreground font-medium">
            {worker.rating.toFixed(1)}
          </Text>
          <Text className="font-caption text-muted-foreground">
            ({worker.reviewCount})
          </Text>
        </View>

        {/* Experience */}
        <View className="bg-primary/10 rounded-full px-3 py-1.5">
          <Text className="font-caption text-primary text-center">
            {worker.yearsOfExperience} years exp.
          </Text>
        </View>
      </Pressable>
    </MotiView>
  );
};
