import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';

import Icons from '@/components/icons';
import { Text } from '@/components/ui';
import { cn } from '@/lib/utils';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  onPress: () => void;
  icon: LucideIcon;
  iconClassName?: string;
  iconContainerClassName?: string;
  containerClassName?: string;
}

interface ProfileQuickActionsProps {
  title?: string;
  actions: QuickAction[];
}

export const ProfileQuickActions: React.FC<ProfileQuickActionsProps> = ({
  title = 'Quick Actions',
  actions,
}) => {
  if (actions.length === 0) return null;

  return (
    <View className="px-6 mb-8">
      <Text className="font-title text-lg text-foreground mb-4">{title}</Text>
      <View className="gap-3">
        {actions.map((action) => (
          <Pressable
            key={action.id}
            onPress={action.onPress}
            className={cn(
              'bg-card/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50 flex-row items-center justify-between active:scale-[0.98]',
              action.containerClassName,
            )}
          >
            <View className="flex-row items-center gap-4">
              <View
                className={cn(
                  'w-12 h-12 rounded-xl items-center justify-center',
                  action.iconContainerClassName,
                )}
              >
                <action.icon size={24} className={action.iconClassName} />
              </View>
              <View>
                <Text className="font-subtitle text-foreground mb-1">
                  {action.title}
                </Text>
                <Text className="font-caption text-muted-foreground">
                  {action.description}
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
