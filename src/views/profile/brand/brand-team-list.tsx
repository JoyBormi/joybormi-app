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
    <View className="px-2 mb-8">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4 px-2">
        <Text className="font-title text-foreground">
          Team ({workers.length})
        </Text>

        {canEdit && (
          <Pressable
            onPress={onAddWorker}
            className="flex-row items-center gap-1"
          >
            <Text className="font-body text-primary">Add</Text>
            <Icons.ChevronRight size={16} className="text-primary" />
          </Pressable>
        )}
      </View>

      {/* Grouped Card */}
      <View className="bg-card rounded-lg overflow-hidden">
        {workers.map((worker, index) => {
          const avatarSource = worker.avatar
            ? { uri: worker.avatar }
            : placeholder.avatar;

          return (
            <View key={worker.id}>
              <MotiView
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
                  className="px-3 py-2.5 flex-row items-center gap-4 active:opacity-80"
                >
                  <Image
                    source={avatarSource}
                    className="w-20 h-20 rounded-md"
                    resizeMode="cover"
                  />

                  <View className="flex-1">
                    <Text className="font-title text-foreground">
                      {worker.username ?? 'Unnamed Worker'}
                    </Text>

                    <Text className="font-caption text-muted-foreground mt-1">
                      {worker.jobTitle ?? 'Team Member'}
                    </Text>
                  </View>

                  <Icons.ChevronRight
                    size={22}
                    className="text-muted-foreground pr-2"
                  />
                </Pressable>
              </MotiView>

              {index !== workers.length - 1 && (
                <View className="h-px bg-border ml-5" />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};
