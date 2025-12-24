import { Text } from '@/components/ui';
import Icons from '@/lib/icons';
import { cn } from '@/lib/utils';
import type { IWorkingDay } from '@/types/worker.type';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { LocaleConfig } from 'react-native-calendars';

interface ScheduleDisplayProps {
  workingDays: IWorkingDay[];
  onEditSchedule: () => void;
}

/**
 * Schedule Display Component
 * Displays working days calendar
 */
export const ScheduleDisplay: React.FC<ScheduleDisplayProps> = ({
  workingDays,
  onEditSchedule,
}) => {
  const { i18n } = useTranslation();
  const days = LocaleConfig.locales[i18n.language]?.dayNamesShort ?? [];
  return (
    <View className="px-6 mb-8">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="font-title text-lg text-foreground">
          Schedule Overview
        </Text>
        <Pressable onPress={onEditSchedule}>
          <Icons.Calendar size={20} className="text-primary" />
        </Pressable>
      </View>
      <View className="bg-card/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50">
        <Text className="font-body text-muted-foreground mb-3">
          Working {workingDays.length} days per week
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {days.map((day: string, index: number) => {
            const isWorking = workingDays.some((wd) => {
              const uiIndex = wd.dayOfWeek % 7;
              return uiIndex === index;
            });

            return (
              <View
                key={day}
                className={cn(
                  'w-12 h-12 rounded-xl items-center justify-center',
                  isWorking
                    ? 'bg-success/20 border border-success/30'
                    : 'bg-muted/20',
                )}
              >
                <Text
                  className={cn(
                    'font-caption',
                    isWorking ? 'text-success' : 'text-muted-foreground',
                  )}
                >
                  {day}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};
