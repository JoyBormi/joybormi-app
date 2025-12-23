import { Text } from '@/components/ui';
import Icons from '@/lib/icons';
import { cn } from '@/lib/utils';
import React from 'react';
import { Pressable, View } from 'react-native';
import type { WorkingDay } from '../worker-profile.d';

interface ScheduleOverviewProps {
  workingDays: WorkingDay[];
  onEditSchedule: () => void;
}

/**
 * Schedule Overview Component
 * Displays working days calendar
 */
export const ScheduleOverview: React.FC<ScheduleOverviewProps> = ({
  workingDays,
  onEditSchedule,
}) => {
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
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
            (day, index) => {
              const isWorking = workingDays.some(
                (wd) => wd.day_of_week === index,
              );
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
            },
          )}
        </View>
      </View>
    </View>
  );
};
