import CustomBottomSheet from '@/components/shared/bottom-sheet';
import { TimePickerSheet } from '@/components/shared/time-picker.sheet';
import { Button, Text } from '@/components/ui';
import Icons from '@/lib/icons';
import { cn } from '@/lib/utils';
import type { IWorkingDay } from '@/types/worker.type';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
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
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

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
  } | null>(null);

  const timePickerRef = useRef<BottomSheetModal>(null);

  // --- Strict 24h Helpers ---
  const formatTime24h = (time: string) => {
    if (!time) return '--:--';
    const parts = time.split(':');
    return `${parts[0]}:${parts[1]}`;
  };

  const timeToDate = (time: string): Date => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return date;
  };

  const dateToTimeStr = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}:00`;
  };

  // --- Actions ---
  const toggleDay = (dayOfWeek: number) => {
    setSchedule((prev) => {
      // Use findIndex and explicit comparison to avoid 0/falsy issues
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
          startTime: '09:00:00',
          endTime: '18:00:00',
          createdAt: new Date().toISOString(),
        },
      ];
    });
  };

  const openTimePicker = (dayOfWeek: number, field: 'start' | 'end') => {
    setEditingState({ day: dayOfWeek, field });
    timePickerRef.current?.present();
  };

  const handleTimeChange = (date: Date) => {
    if (!editingState) return;
    const newTime = dateToTimeStr(date);
    setSchedule((prev) =>
      prev.map((wd) =>
        wd.dayOfWeek === editingState.day
          ? {
              ...wd,
              [editingState.field === 'start' ? 'startTime' : 'endTime']:
                newTime,
            }
          : wd,
      ),
    );
  };

  const activeWorkingDayValue = useMemo(() => {
    if (!editingState) return '09:00:00';
    const day = schedule.find((s) => s.dayOfWeek === editingState.day);
    return editingState.field === 'start' ? day?.startTime : day?.endTime;
  }, [editingState, schedule]);

  return (
    <Fragment>
      <CustomBottomSheet
        ref={ref}
        index={0}
        snapPoints={['90%', '99%']}
        scrollEnabled
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
                  <View className="flex-row items-center gap-2 mt-4 pt-4 border-t border-border/50">
                    <TimeButton
                      label={'Start'}
                      value={formatTime24h(config.startTime)}
                      onPress={() => openTimePicker(dayValue, 'start')}
                    />
                    <View className="h-[1px] w-3 bg-border" />
                    <TimeButton
                      label={'End'}
                      value={formatTime24h(config.endTime)}
                      onPress={() => openTimePicker(dayValue, 'end')}
                    />
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
              (ref as any)?.current?.dismiss();
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
        value={timeToDate(activeWorkingDayValue || '09:00:00')}
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
}: {
  label: string;
  value: string;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    className="flex-1 bg-muted/20 active:bg-muted/40 rounded-2xl p-3 flex-row items-center justify-between border border-border/10"
  >
    <View>
      <Text className="text-[10px] uppercase tracking-tighter text-muted-foreground font-bold mb-0.5">
        {label}
      </Text>
      <Text className="text-xl font-medium text-foreground tracking-tight">
        {value}
      </Text>
    </View>
    <Icons.ChevronDown size={14} className="text-muted-foreground/60" />
  </Pressable>
);

ManageScheduleSheet.displayName = 'ManageScheduleSheet';
