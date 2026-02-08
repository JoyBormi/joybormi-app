import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

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

export const ScheduleDisplay: React.FC<ScheduleDisplayProps> = ({
  workingDays,
  onEditSchedule,
  canEdit = true,
}) => {
  const { dayNamesShort, dayNames } = useLocaleData();

  if (workingDays.length === 0) return null;

  const today = new Date();
  const todayUiIndex = (today.getDay() + 6) % 7; // Monday = 0

  const getDateForWeekday = (uiIndex: number) => {
    const date = new Date(today);
    date.setDate(today.getDate() + (uiIndex - todayUiIndex));
    return date;
  };

  return (
    <ScrollView
      className="flex-1 bg-background px-6"
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Large Hero Header */}
      <View className="pb-6 flex-row items-center justify-between">
        <View>
          <Text className="font-title text-3xl text-foreground">Schedule</Text>
          <Text className="font-body text-muted-foreground mt-1">
            Weekly working routine
          </Text>
        </View>
        {canEdit && (
          <Pressable
            onPress={onEditSchedule}
            className="h-12 w-12 bg-primary/10 rounded-full items-center justify-center"
          >
            <Icons.Calendar size={24} className="text-primary" />
          </Pressable>
        )}
      </View>

      {/* 2. Quick Stats Row */}
      <View className="flex-row gap-4 mb-8">
        <View className="flex-1 bg-success/10 p-5 rounded-xl border border-success/20">
          <Text className="text-success font-title text-3xl">
            {workingDays.length}
          </Text>
          <Text className="text-success/80 font-subtitle uppercase tracking-wider">
            Work Days
          </Text>
        </View>
        <View className="flex-1 bg-muted/30 p-5 rounded-xl">
          <Text className="text-muted-foreground font-title">
            {7 - workingDays.length}
          </Text>
          <Text className="text-muted-foreground/80 font-subtitle uppercase tracking-wider">
            Rest Days
          </Text>
        </View>
      </View>

      {/* 3. Detailed List of Days */}
      <View className="gap-y-3 pb-12">
        {DAY_ORDER.map((day) => {
          const date = getDateForWeekday(day);
          const isToday = date.toDateString() === today.toDateString();
          const isWorking = workingDays.some(
            (dayObj) => dayObj.dayOfWeek === day,
          );

          return (
            <View
              key={day}
              className={cn(
                'flex-row items-center p-4 rounded-lg border',
                isWorking
                  ? 'bg-card border-border shadow-sm'
                  : 'bg-muted/30 border-transparent opacity-60',
              )}
            >
              {/* Date Circle */}
              <View
                className={cn(
                  'w-14 h-14 rounded-full items-center justify-center mr-4',
                  isWorking ? 'bg-success/20' : 'bg-muted',
                )}
              >
                <Text
                  className={cn(
                    'font-title',
                    isWorking ? 'text-success' : 'text-muted-foreground',
                  )}
                >
                  {date.getDate()}
                </Text>
              </View>

              {/* Day Info */}
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text
                    className={cn(
                      'font-title',
                      isWorking ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {dayNames ? dayNames[day] : dayNamesShort[day]}
                  </Text>
                  {isToday && (
                    <View className="ml-2 px-2 py-0.5 bg-primary rounded-xs">
                      <Text className="font-base text-primary-foreground uppercase">
                        Today
                      </Text>
                    </View>
                  )}
                </View>
                <Text className="text-muted-foreground font-caption">
                  {isWorking ? 'Scheduled Shift' : 'Unavailable'}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};
