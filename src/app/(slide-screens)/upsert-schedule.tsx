import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router, useLocalSearchParams } from 'expo-router';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KeyboardAvoid } from '@/components/shared';
import { Header } from '@/components/shared/header';
import { Loading } from '@/components/shared/status-screens';
import { TimePickerSheet } from '@/components/shared/time-picker.sheet';
import { Button, Text } from '@/components/ui';
import { useLocaleData } from '@/hooks/common/use-locale-data';
import {
  useCreateSchedule,
  useGetSchedule,
  useUpdateSchedule,
} from '@/hooks/schedule';
import { agent } from '@/lib/agent';
import Icons from '@/lib/icons';
import { cn } from '@/lib/utils';
import { alert } from '@/stores/use-alert-store';

import type { IWorkingDay } from '@/types/schedule.type';

// Start week from Monday (ISO standard)
// LocaleConfig array: [Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6]
// Database dayOfWeek: [Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6]
// Map LocaleConfig index to database dayOfWeek
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Mon-Sun

const ManageScheduleScreen = () => {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ brandId?: string }>();
  const brandId = params?.brandId;

  const { dayNames } = useLocaleData();

  // Fetch existing schedule
  const { data: scheduleData, isLoading: isLoadingSchedule } = useGetSchedule({
    brandId,
  });

  // Mutations
  const { mutateAsync: createSchedule, isPending: isCreatingSchedule } =
    useCreateSchedule();
  const updateScheduleMutation = useUpdateSchedule(scheduleData?.id);
  const isUpdatingSchedule = updateScheduleMutation.isPending;

  const [schedule, setSchedule] = useState<IWorkingDay[]>([]);
  const [editingState, setEditingState] = useState<{
    day: number;
    field: 'start' | 'end';
    breakId?: string; // For editing break times
  } | null>(null);

  const timePickerRef = useRef<BottomSheetModal>(null);

  // Populate schedule when data is loaded
  useEffect(() => {
    if (scheduleData?.workingDays) {
      setSchedule(scheduleData.workingDays);
    }
  }, [scheduleData]);

  // Format time to HH:mm
  const formatTime = (time: string) => {
    if (!time) return '--:--';
    const parts = time.split(':');
    return `${parts[0]}:${parts[1]}`;
  };

  // --- Actions ---
  const toggleDay = (dayOfWeek: number) => {
    setSchedule((prev) => {
      const index = prev.findIndex((wd) => wd.dayOfWeek === dayOfWeek);
      if (index !== -1) {
        return prev.filter((wd) => wd.dayOfWeek !== dayOfWeek);
      }
      return [
        ...prev,
        {
          id: `new-${dayOfWeek}-${Date.now()}`,
          scheduleId: 'sched-1',
          dayOfWeek,
          startTime: '09:00',
          endTime: '18:00',
          breaks: [],
          createdAt: new Date().toISOString(),
        },
      ];
    });
  };

  const openTimePicker = (
    dayOfWeek: number,
    field: 'start' | 'end',
    breakId?: string,
  ) => {
    setEditingState({ day: dayOfWeek, field, breakId });
    timePickerRef.current?.present();
  };

  const handleTimeChange = (time: string) => {
    if (!editingState) return;

    setSchedule((prev) =>
      prev.map((wd) => {
        if (wd.dayOfWeek !== editingState.day) return wd;

        // Editing break time
        if (editingState.breakId) {
          return {
            ...wd,
            breaks: (wd.breaks || []).map((b) =>
              b.id === editingState.breakId
                ? {
                    ...b,
                    [editingState.field === 'start' ? 'startTime' : 'endTime']:
                      time,
                  }
                : b,
            ),
          };
        }

        // Editing working day time
        return {
          ...wd,
          [editingState.field === 'start' ? 'startTime' : 'endTime']: time,
        };
      }),
    );
  };

  const addBreak = (dayOfWeek: number) => {
    setSchedule((prev) =>
      prev.map((wd) =>
        wd.dayOfWeek === dayOfWeek
          ? {
              ...wd,
              breaks: [
                ...(wd.breaks || []),
                {
                  id: `break-${Date.now()}`,
                  workingDayId: wd.id,
                  startTime: '12:00',
                  endTime: '13:00',
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : wd,
      ),
    );
  };

  const removeBreak = (dayOfWeek: number, breakId: string) => {
    setSchedule((prev) =>
      prev.map((wd) =>
        wd.dayOfWeek === dayOfWeek
          ? {
              ...wd,
              breaks: (wd.breaks || []).filter((b) => b.id !== breakId),
            }
          : wd,
      ),
    );
  };

  const handleSave = async () => {
    if (!brandId) return;

    // Validate that at least one day is configured
    if (schedule.length === 0) {
      alert({
        title: 'No Working Days',
        subtitle: 'Please add at least one working day before saving.',
        confirmLabel: 'OK',
      });
      return;
    }

    try {
      const workingDaysPayload = {
        days: schedule.map((day) => ({
          dayOfWeek: day.dayOfWeek,
          startTime: day.startTime,
          endTime: day.endTime,
          breaks: day.breaks?.map((b) => ({
            startTime: b.startTime,
            endTime: b.endTime,
          })),
        })),
      };

      if (scheduleData?.id) {
        // Update existing schedule
        await updateScheduleMutation.mutateAsync(workingDaysPayload);
        alert({
          title: 'Success',
          subtitle: 'Working hours updated successfully',
          confirmLabel: 'OK',
          onConfirm: () => router.back(),
        });
      } else {
        // Create new schedule first
        const newSchedule = await createSchedule({ brandId });

        // Then update with working days using the new schedule ID
        if (newSchedule?.id && schedule.length > 0) {
          // Use agent API directly to update the newly created schedule
          await agent.put(
            `/schedule/${newSchedule.id}/working-days`,
            workingDaysPayload,
          );
        }

        alert({
          title: 'Success',
          subtitle: 'Schedule created successfully',
          confirmLabel: 'OK',
          onConfirm: () => router.back(),
        });
      }
    } catch (error) {
      console.error('Failed to save schedule:', error);
    }
  };

  const activeWorkingDayValue = useMemo(() => {
    if (!editingState) return '09:00';
    const day = schedule.find((s) => s.dayOfWeek === editingState.day);
    if (!day) return '09:00';

    // Editing break time
    if (editingState.breakId) {
      const breakItem = day.breaks?.find((b) => b.id === editingState.breakId);
      return editingState.field === 'start'
        ? breakItem?.startTime || '12:00'
        : breakItem?.endTime || '13:00';
    }

    // Editing working day time
    return editingState.field === 'start' ? day.startTime : day.endTime;
  }, [editingState, schedule]);

  // Show loading state
  if (isLoadingSchedule) {
    return <Loading />;
  }

  return (
    <Fragment>
      <KeyboardAvoid className="main-area">
        <Header title="Working Hours" subtitle="Manage your working hours" />

        <View className="gap-y-3">
          {DAY_ORDER.map((dayValue, localeIndex) => {
            const config = schedule.find((wd) => wd.dayOfWeek === dayValue);
            const isActive = !!config;
            const label = dayNames[localeIndex];

            return (
              <View
                key={dayValue}
                className={cn(
                  'rounded-3xl border p-4 transition-all',
                  isActive
                    ? 'bg-card border-primary/20 shadow-sm'
                    : 'bg-muted/5 border-transparent',
                )}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View
                      className={cn(
                        'w-2 h-2 rounded-full',
                        isActive ? 'bg-primary' : 'bg-muted-foreground/20',
                      )}
                    />
                    <Text
                      className={cn(
                        'text-lg font-semibold',
                        isActive ? 'text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      {label}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => toggleDay(dayValue)}
                    className={cn(
                      'px-4 py-1.5 rounded-full border',
                      isActive
                        ? 'bg-primary border-primary'
                        : 'bg-transparent border-border/50',
                    )}
                  >
                    <Text
                      className={cn(
                        'text-[10px] font-black',
                        isActive
                          ? 'text-primary-foreground'
                          : 'text-muted-foreground',
                      )}
                    >
                      {isActive ? 'ACTIVE' : 'OFF'}
                    </Text>
                  </Pressable>
                </View>

                {isActive && config && (
                  <View className="mt-4 pt-4 border-t border-border/50">
                    {/* Working Hours */}
                    <View className="flex-row items-center gap-2 mb-3">
                      <TimeButton
                        label="Open"
                        value={formatTime(config.startTime)}
                        onPress={() => openTimePicker(dayValue, 'start')}
                      />
                      <View className="h-[1px] w-3 bg-border" />
                      <TimeButton
                        label="Close"
                        value={formatTime(config.endTime)}
                        onPress={() => openTimePicker(dayValue, 'end')}
                      />
                    </View>

                    {/* Breaks */}
                    {config.breaks && config.breaks.length > 0 && (
                      <View className="gap-2 mb-2">
                        {config.breaks.map((breakItem, idx) => (
                          <View
                            key={breakItem.id}
                            className="flex-row items-center gap-2 bg-muted/10 rounded-xl p-2"
                          >
                            <Icons.Coffee
                              size={14}
                              className="text-muted-foreground"
                            />
                            <TimeButton
                              label="Break Start"
                              value={formatTime(breakItem.startTime)}
                              onPress={() =>
                                openTimePicker(dayValue, 'start', breakItem.id)
                              }
                              compact
                            />
                            <View className="h-[1px] w-2 bg-border" />
                            <TimeButton
                              label="Break End"
                              value={formatTime(breakItem.endTime)}
                              onPress={() =>
                                openTimePicker(dayValue, 'end', breakItem.id)
                              }
                              compact
                            />
                            <Pressable
                              onPress={() =>
                                removeBreak(dayValue, breakItem.id)
                              }
                              className="ml-auto p-1"
                            >
                              <Icons.X size={16} className="text-destructive" />
                            </Pressable>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Add Break Button */}
                    <Pressable
                      onPress={() => addBreak(dayValue)}
                      className="flex-row items-center gap-2 bg-muted/5 border border-dashed border-border/50 rounded-xl p-3"
                    >
                      <Icons.Plus size={16} className="text-muted-foreground" />
                      <Text className="text-xs text-muted-foreground font-medium">
                        Add Break
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Fixed Floating Footer */}
        <View
          style={{ paddingBottom: insets.bottom + 16 }}
          className="absolute bottom-0 left-0 right-0 bg-background/95 border-t border-border p-5"
        >
          <Button
            size="lg"
            onPress={handleSave}
            disabled={isCreatingSchedule || isUpdatingSchedule}
            className="rounded-2xl shadow-xl shadow-primary/30"
          >
            {(isCreatingSchedule || isUpdatingSchedule) && (
              <ActivityIndicator size="small" color="white" className="mr-2" />
            )}
            <Text className="font-bold text-primary-foreground text-lg">
              {isCreatingSchedule || isUpdatingSchedule
                ? 'Saving...'
                : 'Save Changes'}
            </Text>
          </Button>
        </View>
      </KeyboardAvoid>

      <TimePickerSheet
        ref={timePickerRef}
        value={activeWorkingDayValue || '09:00'}
        onChange={handleTimeChange}
        title={
          editingState
            ? `${editingState.field === 'start' ? 'Open' : 'Close'} - ${
                dayNames[DAY_ORDER.indexOf(editingState.day)]
              }`
            : ''
        }
      />
    </Fragment>
  );
};

export default ManageScheduleScreen;

const TimeButton = ({
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
      'flex-1 bg-muted/20 active:bg-muted/40 rounded-xl flex-row items-center justify-between border border-border/10',
      compact ? 'p-2' : 'p-3 rounded-2xl',
    )}
  >
    <View>
      <Text
        className={cn(
          'uppercase tracking-tighter text-muted-foreground font-bold mb-0.5',
          compact ? 'text-[8px]' : 'text-[10px]',
        )}
      >
        {label}
      </Text>
      <Text
        className={cn(
          'font-medium text-foreground tracking-tight',
          compact ? 'text-sm' : 'text-xl',
        )}
      >
        {value}
      </Text>
    </View>
    <Icons.ChevronDown
      size={compact ? 12 : 14}
      className="text-muted-foreground/60"
    />
  </Pressable>
);
