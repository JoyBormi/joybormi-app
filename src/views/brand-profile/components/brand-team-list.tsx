import { MotiView } from 'moti';
import React from 'react';
import { Image, Pressable, View } from 'react-native';

import Icons from '@/components/icons';
import { NoData } from '@/components/status-screens';
import { Text } from '@/components/ui';

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
  if (workers.length === 0) {
    return (
      <NoData
        title="No Team Members"
        message="Invite your first team member to get started."
        action={
          canEdit
            ? {
                label: 'Invite Worker',
                onPress: onAddWorker,
              }
            : undefined
        }
      />
    );
  }

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
        {workers.map((worker, index) => (
          <MotiView
            key={worker.id}
            from={{ opacity: 0, translateY: 6 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 250, delay: index * 60 }}
          >
            <Pressable
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
                  <Icons.Star
                    size={14}
                    className="text-warning"
                    fill="#f59e0b"
                  />
                  <Text className="font-caption text-foreground">
                    {worker.rating}
                  </Text>
                </View>
              </View>
              <Icons.ChevronRight size={20} className="text-muted-foreground" />
            </Pressable>
          </MotiView>
        ))}
      </View>
    </View>
  );
};
