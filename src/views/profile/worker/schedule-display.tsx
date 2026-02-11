import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import Icons from '@/components/icons';
import { Text } from '@/components/ui';
import { DAY_ORDER } from '@/constants/global.constants';
import { useLocaleData } from '@/hooks/common/use-locale-data';

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
  const todayUiIndex = (today.getDay() + 6) % 7;

  const getDateForWeekday = (uiIndex: number) => {
    const date = new Date(today);
    date.setDate(today.getDate() + (uiIndex - todayUiIndex));
    return date;
  };

  const formatDate = (date: Date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}`;
  };

  const formatWorkingHours = (day: IWorkingDay | undefined) => {
    if (!day) return 'Day Off';
    return `${day.startTime} - ${day.endTime}`;
  };

  return (
    <ScrollView
      className="flex-1 bg-background px-2"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="pb-6 flex-row items-center justify-between px-2">
        <Text className="font-title text-foreground">Weekly routine</Text>

        {canEdit && (
          <Pressable
            onPress={onEditSchedule}
            className="flex-row items-center gap-2"
          >
            <Text className="font-body text-primary">Edit</Text>
            <Icons.ChevronRight size={18} className="text-primary" />
          </Pressable>
        )}
      </View>

      {/* Quick Stats */}
      <View className="bg-muted/60 rounded-xl overflow-hidden mb-8">
        <View className="flex-row">
          {/* Work Days */}
          <View className="flex-1 px-2 py-3 items-center">
            <Text className="font-heading text-foreground">
              {workingDays.length}
            </Text>
            <Text className="font-caption text-muted-foreground mt-1">
              Work Days
            </Text>
          </View>

          {/* Divider */}
          <View className="w-px bg-border/60" />

          {/* Rest Days */}
          <View className="flex-1 px-2 py-3 items-center">
            <Text className="font-heading text-foreground">
              {7 - workingDays.length}
            </Text>
            <Text className="font-caption text-muted-foreground mt-1">
              Rest Days
            </Text>
          </View>
        </View>
      </View>

      {/* Grouped iOS-style Card */}
      <View className="overflow-hidden rounded-lg bg-card">
        {DAY_ORDER.map((day, index) => {
          const date = getDateForWeekday(day);
          const isToday = date.toDateString() === today.toDateString();
          const workingDay = workingDays.find((d) => d.dayOfWeek === day);

          return (
            <View key={day}>
              <View className="flex-row items-center px-5 py-4">
                {/* Left Side */}
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="font-title text-foreground">
                      {dayNames ? dayNames[day] : dayNamesShort[day]}
                    </Text>

                    {isToday && (
                      <View className="px-2 py-0.5 rounded-full bg-primary/10">
                        <Text className="font-base text-primary">Today</Text>
                      </View>
                    )}
                  </View>

                  <Text className="font-caption text-muted-foreground mt-1">
                    {formatWorkingHours(workingDay)}
                  </Text>
                </View>

                {/* Right Side Date */}
                <View className="items-end">
                  <Text className="font-body text-muted-foreground">
                    {formatDate(date)}
                  </Text>
                </View>
              </View>

              {index !== DAY_ORDER.length - 1 && (
                <View className="h-px bg-border ml-5" />
              )}
            </View>
          );
        })}
      </View>

      <View className="h-12" />
    </ScrollView>
  );
};
