import React from 'react';
import { Pressable, View } from 'react-native';

import Icons from '@/components/icons';
import { Text } from '@/components/ui';
import { cn } from '@/lib/utils';

export const TimeButton = ({
  label,
  value,
  onPress,
  compact,
}: {
  label: string;
  value: string;
  onPress: () => void;
  compact?: boolean;
}) => (
  <Pressable
    onPress={onPress}
    className={cn(
      'flex-1 bg-card/50 active:bg-card/50 rounded-md flex-row items-center justify-between border border-border/80',
      compact ? 'p-2.5' : 'p-3.5',
    )}
  >
    <View>
      <Text
        className={cn(
          'font-caption text-muted-foreground mb-0.5',
          compact && 'text-[10px]',
        )}
      >
        {label}
      </Text>
      <Text
        className={cn(
          'font-semibold text-foreground',
          compact ? 'text-base' : 'text-xl',
        )}
      >
        {value}
      </Text>
    </View>
    <Icons.ChevronDown
      size={compact ? 14 : 16}
      className="text-muted-foreground/50"
    />
  </Pressable>
);
