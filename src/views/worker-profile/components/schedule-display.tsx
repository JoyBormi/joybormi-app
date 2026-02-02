import React from 'react';
import { Pressable, View } from 'react-native';

import Icons from '@/components/icons';
import { Text } from '@/components/ui';
import { DAY_ORDER } from '@/constants/global.constants';
import { useLocaleData } from '@/hooks/common/use-locale-data';
import { cn } from '@/lib/utils';

import type { IWorkingDay } from '@/types/schedule.type';

interface ScheduleDisplayProps {
  workingDays: IWorkingDay[];
  onEditSchedule: () => void;
  canEdit?: boolean;
}

/**
 * Schedule Display Component
 * Shows weekly working days with date-of-month
 */
export const ScheduleDisplay: React.FC<ScheduleDisplayProps> = ({
  workingDays,
  onEditSchedule,
  canEdit = true,
}) => {
  const { dayNamesShort } = useLocaleData();

  if (workingDays.length === 0) return null;

  const today = new Date();
  const todayUiIndex = (today.getDay() + 6) % 7; // Monday = 0

  const getDateForWeekday = (uiIndex: number) => {
    const date = new Date(today);
    date.setDate(today.getDate() + (uiIndex - todayUiIndex));
    return date;
  };

  return (
    <View className="px-6 my-12">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="font-title text-lg text-foreground">
          Schedule Overview
        </Text>
        {canEdit && (
          <Pressable onPress={onEditSchedule} hitSlop={10}>
            <Icons.Calendar size={20} className="text-primary" />
          </Pressable>
        )}
      </View>

      {/* Card */}
      <View>
        <Text className="font-body text-muted-foreground mb-4">
          Working {workingDays.length} days per week
        </Text>

        {/* Days grid */}
        <View className="flex-row flex-wrap justify-between gap-1">
          {DAY_ORDER.map((day) => {
            const date = getDateForWeekday(day);
            const isToday = date.toDateString() === today.toDateString();
            const isWorking = workingDays.some((dayObj) => {
              const uiIndex = dayObj.dayOfWeek;
              return uiIndex === day;
            });

            return (
              <View
                key={day}
                className={cn(
                  'w-[12%] h-16 rounded-xl items-center justify-center',
                  isWorking
                    ? 'bg-success/20 border border-success/30'
                    : 'bg-muted/20',
                )}
              >
                {/* Day name */}
                <Text
                  className={cn(
                    'font-caption uppercase',
                    isWorking ? 'text-success' : 'text-muted-foreground',
                  )}
                >
                  {dayNamesShort[day]}
                </Text>

                {/* Day of month */}
                <Text
                  className={cn(
                    'font-caption mt-0.5',
                    isWorking ? 'text-success' : 'text-muted-foreground',
                    isToday && 'font-bold',
                  )}
                >
                  {date.getDate()}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};
