import CustomBottomSheet from '@/components/shared/bottom-sheet';
import { TimePickerSheet } from '@/components/shared/time-picker.sheet';
import { Button, Text } from '@/components/ui';
import Icons from '@/lib/icons';
import { cn } from '@/lib/utils';
import type { IWorkingDay } from '@/types/worker.type';
import {
  BottomSheetModal,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import React, { forwardRef, Fragment, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { LocaleConfig } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ManageScheduleSheetProps {
  workingDays: IWorkingDay[];
  onSave: (workingDays: IWorkingDay[]) => void;
}

// Start week from Monday (ISO standard)
const DAY_ORDER = [0, 1, 2, 3, 4, 5, 6]; // Mon-Sun

export const ManageScheduleSheet = forwardRef<
  BottomSheetModal,
  ManageScheduleSheetProps
>(({ workingDays, onSave }, ref) => {
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const [schedule, setSchedule] = useState<IWorkingDay[]>(workingDays);
  const [editingState, setEditingState] = useState<{
    day: number;
    field: 'start' | 'end';
    breakId?: string; // For editing break times
  } | null>(null);

  const timePickerRef = useRef<BottomSheetModal>(null);

  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 150,
  });

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

  return (
    <Fragment>
      <CustomBottomSheet
        ref={ref}
        index={0}
        scrollEnabled
        snapPoints={['90%', '99%']}
        animationConfigs={animationConfigs}
        scrollConfig={{
          contentContainerStyle: {
            paddingBottom: insets.bottom + 120,
          },
          showsVerticalScrollIndicator: false,
        }}
      >
        <View className="mb-6 mt-2">
          <Text className="text-2xl font-bold text-foreground">
            Working Hours
          </Text>
        </View>

        <View className="gap-y-3">
          {DAY_ORDER.map((dayValue) => {
            const config = schedule.find((wd) => wd.dayOfWeek === dayValue);
            const isActive = !!config;
            const label =
              LocaleConfig.locales[i18n.language].dayNames[dayValue];

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
            onPress={() => {
              onSave(schedule);
              if (ref && 'current' in ref) {
                ref.current?.dismiss();
              }
            }}
            className="rounded-2xl shadow-xl shadow-primary/30"
          >
            <Text className="font-bold text-primary-foreground text-lg">
              Save Changes
            </Text>
          </Button>
        </View>
      </CustomBottomSheet>

      <TimePickerSheet
        ref={timePickerRef}
        value={activeWorkingDayValue || '09:00'}
        onChange={handleTimeChange}
        title={
          editingState
            ? `${editingState.field === 'start' ? 'Open' : 'Close'} - ${LocaleConfig.locales[i18n.language].dayNames[editingState.day]}`
            : ''
        }
      />
    </Fragment>
  );
});

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

ManageScheduleSheet.displayName = 'ManageScheduleSheet';
