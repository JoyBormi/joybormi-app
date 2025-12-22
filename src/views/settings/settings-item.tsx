import { Feedback } from '@/lib/haptics';
import Icons from '@/lib/icons';
import { cn } from '@/lib/utils';
import React from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
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
  const Icon = item.icon;

  const content = (
    <View
      className={cn(
        'flex-row items-center gap-3 px-1.5 py-2.5 bg-card/50 backdrop-blur-sm',
        isFirst && 'rounded-t-2xl',
        isLast && 'rounded-b-2xl',
        !isLast && 'border-b border-border/10',
      )}
    >
      {/* Icon */}
      {Icon && (
        <View
          className={cn(
            'rounded-lg items-center justify-center p-1.5',
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
            'text-base font-subtitle',
            item.destructive ? 'text-destructive' : 'text-foreground',
          )}
        >
          {item.title}
        </Text>
        {item.subtitle && (
          <Text className="text-sm text-muted-foreground font-body mt-0.5">
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
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          Feedback.light();
        }}
      >
        {content}
      </TouchableOpacity>
    );
  }

  if (item.type === 'action' || item.type === 'userType') {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          Feedback.light();
          item.onPress?.();
        }}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};
