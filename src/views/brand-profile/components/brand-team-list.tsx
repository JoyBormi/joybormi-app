import { MotiView } from 'moti';
import React from 'react';
import { Image, Pressable, View } from 'react-native';

import Icons from '@/components/icons';
import { Text } from '@/components/ui';
import { placeholder } from '@/constants/images';

import type { IWorker } from '@/types/worker.type';

interface BrandTeamListProps {
  workers: IWorker[];
  canEdit: boolean;
  onAddWorker: () => void;
  onWorkerPress: (worker: IWorker) => void;
}

export const BrandTeamList: React.FC<BrandTeamListProps> = ({
  workers,
  canEdit,
  onAddWorker,
  onWorkerPress,
}) => {
  if (workers.length === 0) return null;

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
        {workers.map((worker, index) => {
          const avatarSource = worker.avatar
            ? { uri: worker.avatar }
            : placeholder.avatar;

          return (
            <MotiView
              key={worker.id}
              from={{ opacity: 0, translateY: 6 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{
                type: 'timing',
                duration: 250,
                delay: index * 60,
              }}
            >
              <Pressable
                onPress={() => onWorkerPress(worker)}
                className="bg-card/50 backdrop-blur-xl rounded-2xl p-4 border border-border/50 flex-row items-center gap-4 active:scale-[0.98]"
              >
                <Image
                  source={avatarSource}
                  className="w-16 h-16 rounded-2xl"
                  resizeMode="cover"
                />

                <View className="flex-1">
                  <Text className="font-subtitle text-foreground mb-1">
                    {worker.username ?? 'Unnamed Worker'}
                  </Text>

                  <Text className="font-caption text-muted-foreground mb-2">
                    {worker.jobTitle ?? 'Team Member'}
                  </Text>
                </View>

                <Icons.ChevronRight
                  size={20}
                  className="text-muted-foreground"
                />
              </Pressable>
            </MotiView>
          );
        })}
      </View>
    </View>
  );
};
