import CustomBottomSheet from '@/components/shared/bottom-sheet';
import { TimePickerSheet } from '@/components/shared/time-picker-sheet';
import { Button, Text } from '@/components/ui';
import Icons from '@/lib/icons';
import { cn } from '@/lib/utils';
import type { IWorkingDay } from '@/types/worker.type';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { forwardRef, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ManageScheduleSheetProps {
  workingDays: IWorkingDay[];
  onSave: (workingDays: IWorkingDay[]) => void;
}

const DAYS = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
];

/**
 * Manage Schedule Bottom Sheet Component
 * Form for managing worker schedule
 */
export const ManageScheduleSheet = forwardRef<
  BottomSheetModal,
  ManageScheduleSheetProps
>(({ workingDays, onSave }, ref) => {
  const insets = useSafeAreaInsets();
  const [schedule, setSchedule] = useState<IWorkingDay[]>(workingDays);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [editingField, setEditingField] = useState<'start' | 'end' | null>(
    null,
  );

  const timePickerRef = useRef<BottomSheetModal>(null);

  const formatTime = (time: string) => {
    // Convert "09:00:00" to "9:00 AM"
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const timeToDate = (time: string): Date => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return date;
  };

  const dateToTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}:00`;
  };

  const toggleDay = (dayOfWeek: number) => {
    const exists = schedule.find((wd) => wd.dayOfWeek === dayOfWeek);
    if (exists) {
      setSchedule(schedule.filter((wd) => wd.dayOfWeek !== dayOfWeek));
    } else {
      setSchedule([
        ...schedule,
        {
          id: `wd-${Date.now()}`,
          scheduleId: 'schedule-123',
          dayOfWeek,
          startTime: '09:00:00',
          endTime: '17:00:00',
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleTimeEdit = (dayOfWeek: number, field: 'start' | 'end') => {
    setEditingDay(dayOfWeek);
    setEditingField(field);
    timePickerRef.current?.present();
  };

  const handleTimeChange = (date: Date) => {
    if (editingDay === null || editingField === null) return;

    const newTime = dateToTime(date);
    setSchedule(
      schedule.map((wd) =>
        wd.dayOfWeek === editingDay
          ? {
              ...wd,
              [editingField === 'start' ? 'startTime' : 'endTime']: newTime,
            }
          : wd,
      ),
    );
  };

  const handleSave = () => {
    onSave(schedule);
    if (ref && 'current' in ref) {
      ref.current?.dismiss();
    }
  };

  const getWorkingDay = (dayOfWeek: number) => {
    return schedule.find((wd) => wd.dayOfWeek === dayOfWeek);
  };

  return (
    <>
      <CustomBottomSheet
        ref={ref}
        index={0}
        snapPoints={['85%']}
        scrollEnabled
        scrollConfig={{
          contentContainerStyle: {
            paddingBottom: insets.bottom + 20,
          },
        }}
      >
        <View className="mb-6">
          <Text className="font-heading text-xl text-foreground">
            Manage Schedule
          </Text>
          <Text className="font-body text-muted-foreground mt-1">
            Set your working days and hours
          </Text>
        </View>

        <View className="gap-3">
          {DAYS.map((day) => {
            const workingDay = getWorkingDay(day.value);
            const isWorking = !!workingDay;

            return (
              <View
                key={day.value}
                className={cn(
                  'rounded-2xl border overflow-hidden',
                  isWorking
                    ? 'bg-primary/5 border-primary/30'
                    : 'bg-muted/20 border-border/50',
                )}
              >
                <Pressable
                  onPress={() => toggleDay(day.value)}
                  className="flex-row items-center justify-between p-4"
                >
                  <View className="flex-row items-center gap-3">
                    <View
                      className={cn(
                        'w-10 h-10 rounded-xl items-center justify-center',
                        isWorking ? 'bg-primary/20' : 'bg-muted/40',
                      )}
                    >
                      <Text
                        className={cn(
                          'font-subtitle',
                          isWorking ? 'text-primary' : 'text-muted-foreground',
                        )}
                      >
                        {day.label.slice(0, 3)}
                      </Text>
                    </View>
                    <Text className="font-subtitle text-foreground">
                      {day.label}
                    </Text>
                  </View>
                  <View
                    className={cn(
                      'w-6 h-6 rounded-full border-2 items-center justify-center',
                      isWorking
                        ? 'bg-primary border-primary'
                        : 'border-muted-foreground',
                    )}
                  >
                    {isWorking && (
                      <Icons.Check
                        size={14}
                        className="text-primary-foreground"
                        strokeWidth={3}
                      />
                    )}
                  </View>
                </Pressable>

                {isWorking && workingDay && (
                  <View className="px-4 pb-4 flex-row gap-3">
                    <Pressable
                      onPress={() => handleTimeEdit(day.value, 'start')}
                      className="flex-1 bg-background/50 rounded-xl p-3 border border-border/30"
                    >
                      <Text className="font-caption text-muted-foreground mb-1">
                        Start Time
                      </Text>
                      <Text className="font-subtitle text-foreground">
                        {formatTime(workingDay.startTime)}
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleTimeEdit(day.value, 'end')}
                      className="flex-1 bg-background/50 rounded-xl p-3 border border-border/30"
                    >
                      <Text className="font-caption text-muted-foreground mb-1">
                        End Time
                      </Text>
                      <Text className="font-subtitle text-foreground">
                        {formatTime(workingDay.endTime)}
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View className="mt-6 gap-3">
          <Button onPress={handleSave} className="bg-primary">
            <Text className="font-subtitle text-primary-foreground">
              Save Schedule
            </Text>
          </Button>
          <Button
            onPress={() => {
              if (ref && 'current' in ref) {
                ref.current?.dismiss();
              }
            }}
            variant="outline"
          >
            <Text className="font-subtitle text-foreground">Cancel</Text>
          </Button>
        </View>
      </CustomBottomSheet>

      {/* Time Picker */}
      <TimePickerSheet
        ref={timePickerRef}
        value={
          editingDay !== null && editingField !== null
            ? timeToDate(
                getWorkingDay(editingDay)?.[
                  editingField === 'start' ? 'startTime' : 'endTime'
                ] || '09:00:00',
              )
            : new Date()
        }
        onChange={handleTimeChange}
        title={`Select ${editingField === 'start' ? 'Start' : 'End'} Time`}
      />
    </>
  );
});

ManageScheduleSheet.displayName = 'ManageScheduleSheet';
