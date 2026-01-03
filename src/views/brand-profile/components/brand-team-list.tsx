import React from 'react';
import { Image, Pressable, View } from 'react-native';

import { Text } from '@/components/ui';
import Icons from '@/lib/icons';

import type { IWorker } from '@/types/worker.type';

interface BrandTeamListProps {
  workers: IWorker[];
  canEdit: boolean;
  onAddWorker: () => void;
  onWorkerPress: (worker: IWorker) => void;
}

/**
 * Brand Team List Component
 * Displays list of team members with add button
 */
export const BrandTeamList: React.FC<BrandTeamListProps> = ({
  workers,
  canEdit,
  onAddWorker,
  onWorkerPress,
}) => {
  return (
    <View className="px-6 mb-8">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="font-title text-lg text-foreground">
          Team ({workers.length})
        </Text>
        {canEdit && (
          <Pressable onPress={onAddWorker}>
            <Icons.Plus size={20} className="text-primary" />
          </Pressable>
        )}
      </View>
      <View className="gap-3">
        {workers.map((worker) => (
          <Pressable
            key={worker.id}
            onPress={() => onWorkerPress(worker)}
            className="bg-card/50 backdrop-blur-xl rounded-2xl p-4 border border-border/50 flex-row items-center gap-4 active:scale-[0.98]"
          >
            <Image
              source={{ uri: worker.avatar }}
              className="w-16 h-16 rounded-2xl"
            />
            <View className="flex-1">
              <Text className="font-subtitle text-foreground mb-1">
                {worker.name}
              </Text>
              <Text className="font-caption text-muted-foreground mb-2">
                {worker.role}
              </Text>
              <View className="flex-row items-center gap-1">
                <Icons.Star size={14} className="text-warning" fill="#f59e0b" />
                <Text className="font-caption text-foreground">
                  {worker.rating}
                </Text>
              </View>
            </View>
            <Icons.ChevronRight size={20} className="text-muted-foreground" />
          </Pressable>
        ))}
      </View>
    </View>
  );
};
