import React from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui';
import Icons from '@/lib/icons';

interface BrandQuickActionsProps {
  onAddService: () => void;
  onAddWorker: () => void;
  onManageHours: () => void;
}

/**
 * Brand Quick Actions Component
 * Displays action cards for common brand management tasks
 */
export const BrandQuickActions: React.FC<BrandQuickActionsProps> = ({
  onAddService,
  onAddWorker,
  onManageHours,
}) => {
  return (
    <View className="px-6 mb-8">
      <Text className="font-title text-lg text-foreground mb-4">
        Quick Actions
      </Text>
      <View className="gap-3">
        <Pressable
          onPress={onAddService}
          className="bg-card/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50 flex-row items-center justify-between active:scale-[0.98]"
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
          onPress={onAddWorker}
          className="bg-card/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50 flex-row items-center justify-between active:scale-[0.98]"
        >
          <View className="flex-row items-center gap-4">
            <View className="w-12 h-12 rounded-xl bg-success/10 items-center justify-center">
              <Icons.UserPlus size={24} className="text-success" />
            </View>
            <View>
              <Text className="font-subtitle text-foreground mb-1">
                Invite Team Member
              </Text>
              <Text className="font-caption text-muted-foreground">
                Add a new worker to your team
              </Text>
            </View>
          </View>
          <Icons.ChevronRight size={20} className="text-muted-foreground" />
        </Pressable>

        <Pressable
          onPress={onManageHours}
          className="bg-card/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50 flex-row items-center justify-between active:scale-[0.98]"
        >
          <View className="flex-row items-center gap-4">
            <View className="w-12 h-12 rounded-xl bg-warning/10 items-center justify-center">
              <Icons.Calendar size={24} className="text-warning" />
            </View>
            <View>
              <Text className="font-subtitle text-foreground mb-1">
                Manage Hours
              </Text>
              <Text className="font-caption text-muted-foreground">
                Set your business hours
              </Text>
            </View>
          </View>
          <Icons.ChevronRight size={20} className="text-muted-foreground" />
        </Pressable>
      </View>
    </View>
  );
};
