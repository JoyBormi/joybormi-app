import { Text } from '@/components/ui';
import Icons from '@/lib/icons';
import React from 'react';
import { Pressable, View } from 'react-native';

interface QuickActionsSectionProps {
  onAddService: () => void;
  onEditSchedule: () => void;
}

/**
 * Quick Actions Section Component
 * Provides quick access to add service and manage schedule
 */
export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  onAddService,
  onEditSchedule,
}) => {
  return (
    <View className="px-6 mb-8">
      <Text className="font-title text-lg text-foreground mb-4">
        Quick Actions
      </Text>
      <View className="gap-3">
        <Pressable
          onPress={onAddService}
          className="bg-card/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50 flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-4">
            <View className="w-12 h-12 rounded-xl bg-primary/10 items-center justify-center">
              <Icons.Plus size={24} className="text-primary" />
            </View>
            <View>
              <Text className="font-subtitle text-foreground mb-1">
                Add New Service
              </Text>
              <Text className="font-caption text-muted-foreground">
                Create a new service offering
              </Text>
            </View>
          </View>
          <Icons.ChevronRight size={20} className="text-muted-foreground" />
        </Pressable>

        <Pressable
          onPress={onEditSchedule}
          className="bg-card/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50 flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-4">
            <View className="w-12 h-12 rounded-xl bg-success/10 items-center justify-center">
              <Icons.Calendar size={24} className="text-success" />
            </View>
            <View>
              <Text className="font-subtitle text-foreground mb-1">
                Manage Schedule
              </Text>
              <Text className="font-caption text-muted-foreground">
                Set your working hours
              </Text>
            </View>
          </View>
          <Icons.ChevronRight size={20} className="text-muted-foreground" />
        </Pressable>
      </View>
    </View>
  );
};
