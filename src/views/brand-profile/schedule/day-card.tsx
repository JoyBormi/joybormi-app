import React from 'react';
import { Pressable, View } from 'react-native';

import Icons from '@/components/icons';
import { PressableBounce, Text } from '@/components/ui';
import { cn } from '@/lib/utils';

import { TimeButton } from './schedule-time-button';

import type { IWorkingDay } from '@/types/schedule.type';

interface DayCardProps {
  dayValue: number;
  label: string;
  config?: IWorkingDay;
  isActive: boolean;
  onToggle: (dayValue: number) => void;
  onOpenTimePicker: (
    dayOfWeek: number,
    field: 'start' | 'end',
    breakId?: string,
  ) => void;
  onAddBreak: (dayOfWeek: number) => void;
  onRemoveBreak: (dayOfWeek: number, breakId: string) => void;
  formatTime: (time?: string) => string;
}

export const DayCard: React.FC<DayCardProps> = ({
  dayValue,
  label,
  config,
  isActive,
  onToggle,
  onOpenTimePicker,
  onAddBreak,
  onRemoveBreak,
  formatTime,
}) => {
  return (
    <View
      className={cn(
        'rounded-2xl border transition-all',
        isActive
          ? 'bg-popover border-primary/20 '
          : 'bg-muted/5 border-border/10',
      )}
    >
      <PressableBounce
        onPress={() => onToggle(dayValue)}
        className="flex-row items-center justify-between p-4"
      >
        <View className="flex-row items-center gap-3">
          <View
            className={cn(
              'w-2.5 h-2.5 rounded-full',
              isActive ? 'bg-primary' : 'bg-muted-foreground/30',
            )}
          />
          <Text
            className={cn(
              'font-title',
              isActive ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            {label}
          </Text>
        </View>
        <View
          className={cn(
            'px-3 py-1.5 rounded-lg',
            isActive ? 'bg-success/10' : 'bg-muted/20',
          )}
        >
          <Text
            className={cn(
              'font-caption min-w-12 text-center',
              isActive ? 'text-success' : 'text-muted-foreground',
            )}
          >
            {isActive ? 'Active' : 'Off'}
          </Text>
        </View>
      </PressableBounce>

      {isActive && config && (
        <View className="px-4 pb-4 pt-3 border-t border-border/10">
          {/* Working Hours */}
          <View className="flex-row items-center gap-3 mb-4">
            <TimeButton
              label="Open"
              value={formatTime(config.startTime)}
              onPress={() => onOpenTimePicker(dayValue, 'start')}
            />
            <View className="h-0.5 w-3 bg-border" />
            <TimeButton
              label="Close"
              value={formatTime(config.endTime)}
              onPress={() => onOpenTimePicker(dayValue, 'end')}
            />
          </View>

          {/* Breaks */}
          {config.breaks && config.breaks.length > 0 && (
            <View className="gap-3 mb-3">
              {config.breaks.map((breakItem) => (
                <View key={breakItem.id} className="bg-muted/10 rounded-md">
                  <View className="flex-row items-center gap-2 pb-4 px-1.5">
                    <Icons.Coffee size={16} className="text-muted-foreground" />
                    <Pressable
                      onPress={() => onRemoveBreak(dayValue, breakItem.id)}
                      className="ml-auto p-1.5 active:scale-95"
                    >
                      <Icons.X size={18} className="text-destructive" />
                    </Pressable>
                  </View>
                  <View className="flex-row items-center gap-3">
                    <TimeButton
                      label="Start"
                      value={formatTime(breakItem.startTime)}
                      onPress={() =>
                        onOpenTimePicker(dayValue, 'start', breakItem.id)
                      }
                      compact
                    />
                    <View className="h-0.5 w-3 bg-border/70" />
                    <TimeButton
                      label="End"
                      value={formatTime(breakItem.endTime)}
                      onPress={() =>
                        onOpenTimePicker(dayValue, 'end', breakItem.id)
                      }
                      compact
                    />
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Add Break Button */}
          <Pressable
            onPress={() => onAddBreak(dayValue)}
            className="flex-row items-center justify-center gap-2 bg-card/5 border border-dashed border-border/70 rounded-md p-3 active:bg-muted/10"
          >
            <Icons.Plus size={18} className="text-card-foreground" />
            <Text className="font-body text-card-foreground">Add Break</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};
