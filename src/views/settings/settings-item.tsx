import { RelativePathString, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Switch, Text, View } from 'react-native';

import Icons from '@/components/icons';
import { Feedback } from '@/lib/haptics';
import { cn } from '@/lib/utils';

import { ISettingsItem } from './types';

interface Props {
  item: ISettingsItem;
  isFirst?: boolean;
  isLast?: boolean;
  onToggle?: (value: boolean) => void;
}

export const SettingsItem: React.FC<Props> = ({
  item,
  isFirst,
  isLast,
  onToggle,
}) => {
  const router = useRouter();
  const Icon = item.icon;

  const content = (
    <View
      className={cn(
        'flex-row items-center gap-3 px-3 py-2.5 bg-card/80 backdrop-blur-sm',
        isFirst && 'rounded-t-2xl',
        isLast && 'rounded-b-2xl',
        !isLast && 'border-b border-border/10',
        item.withdraw && 'bg-transparent',
      )}
    >
      {/* Icon */}
      {Icon && (
        <View
          className={cn(
            'rounded-md items-center justify-center p-1.5',
            item.iconBgColor || 'bg-primary/10',
          )}
        >
          <Icon
            className={cn('w-4.5 h-4.5', item.iconColor || 'text-primary')}
          />
        </View>
      )}

      {/* Content */}
      <View className="flex-1">
        <Text
          className={cn(
            'font-body',
            item.destructive ? 'text-destructive' : 'text-foreground',
            item.withdraw ? 'font-caption text-center' : '',
          )}
        >
          {item.title}
        </Text>
        {item.subtitle && (
          <Text className="font-caption text-muted-foreground mt-0.5">
            {item.subtitle}
          </Text>
        )}
      </View>

      {/* Right Side */}
      {item.type === 'toggle' && typeof item.value === 'boolean' && (
        <Switch
          value={item.value}
          onValueChange={(value) => {
            Feedback.light();
            onToggle?.(value);
          }}
          trackColor={{
            false: 'hsl(var(--muted))',
            true: 'hsl(var(--primary))',
          }}
          thumbColor="white"
        />
      )}

      {item.type === 'navigation' && (
        <Icons.ChevronRight className="text-muted-foreground w-5 h-5" />
      )}

      {item.type === 'info' && item.value && (
        <Text className="text-sm text-muted-foreground font-body">
          {item.value}
        </Text>
      )}

      {item.badge && (
        <View className="bg-destructive px-2 py-0.5 rounded-full">
          <Text className="text-xs text-white font-subtitle">{item.badge}</Text>
        </View>
      )}
    </View>
  );

  if (item.type === 'navigation' && item.href) {
    return (
      <Pressable
        onPress={() => {
          Feedback.light();
          router.push(item.href as RelativePathString);
        }}
      >
        {content}
      </Pressable>
    );
  }

  if (item.type === 'action' || item.type === 'userType') {
    return (
      <Pressable
        onPress={() => {
          Feedback.light();
          item.onPress?.();
        }}
      >
        {content}
      </Pressable>
    );
  }

  return content;
};
