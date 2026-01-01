import { MotiView } from 'moti';
import React from 'react';
import { View } from 'react-native';

import { Button, Text } from '@/components/ui';
import Icons from '@/lib/icons';

interface WorkingDay {
  id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  breaks?: {
    id: string;
    start_time: string;
    end_time: string;
  }[];
}

interface MemberScheduleTabProps {
  workingDays: WorkingDay[];
  isOwner: boolean;
  onEditSchedule?: () => void;
}

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const formatTime = (time: string): string => {
  // Convert HH:MM:SS to HH:MM AM/PM
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const MemberScheduleTab: React.FC<MemberScheduleTabProps> = ({
  workingDays,
  isOwner,
  onEditSchedule,
}) => {
  return (
    <View className="px-4">
      {/* Edit Schedule Button - Only for owner */}
      {isOwner && (
        <Button
          onPress={onEditSchedule}
          className="mb-4 bg-primary/10 border border-primary/20"
        >
          <View className="flex-row items-center gap-2">
            <Icons.Calendar size={20} className="text-primary" />
            <Text className="font-subtitle text-primary">Edit Schedule</Text>
          </View>
        </Button>
      )}

      {/* Working Days */}
      {workingDays.length === 0 ? (
        <View className="items-center justify-center py-12">
          <Icons.Calendar size={48} className="text-muted-foreground mb-3" />
          <Text className="font-title text-foreground mb-1">
            No Schedule Set
          </Text>
          <Text className="font-body text-muted-foreground text-center">
            {isOwner
              ? 'Set your working hours to start accepting bookings'
              : 'This member has not set their schedule yet'}
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {DAY_NAMES.map((dayName, dayIndex) => {
            const workingDay = workingDays.find(
              (wd) => wd.day_of_week === dayIndex,
            );

            return (
              <MotiView
                key={dayIndex}
                from={{ opacity: 0, translateX: -10 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{
                  type: 'timing',
                  duration: 300,
                  delay: dayIndex * 50,
                }}
              >
                <View className="bg-card/30 backdrop-blur-sm rounded-2xl p-4 border border-border/50">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-subtitle text-foreground">
                      {dayName}
                    </Text>
                    {workingDay ? (
                      <View className="items-end">
                        <Text className="font-body text-foreground">
                          {formatTime(workingDay.start_time)} -{' '}
                          {formatTime(workingDay.end_time)}
                        </Text>
                        {workingDay.breaks && workingDay.breaks.length > 0 && (
                          <Text className="font-caption text-muted-foreground mt-1">
                            {workingDay.breaks.length} break
                            {workingDay.breaks.length > 1 ? 's' : ''}
                          </Text>
                        )}
                      </View>
                    ) : (
                      <Text className="font-body text-muted-foreground">
                        Closed
                      </Text>
                    )}
                  </View>

                  {/* Show breaks if any */}
                  {workingDay?.breaks && workingDay.breaks.length > 0 && (
                    <View className="mt-3 pt-3 border-t border-border/30">
                      <Text className="font-caption text-muted-foreground mb-2">
                        Breaks:
                      </Text>
                      {workingDay.breaks.map((breakTime) => (
                        <View
                          key={breakTime.id}
                          className="flex-row items-center gap-2 mb-1"
                        >
                          <Icons.Coffee
                            size={14}
                            className="text-muted-foreground"
                          />
                          <Text className="font-caption text-muted-foreground">
                            {formatTime(breakTime.start_time)} -{' '}
                            {formatTime(breakTime.end_time)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </MotiView>
            );
          })}
        </View>
      )}
    </View>
  );
};
