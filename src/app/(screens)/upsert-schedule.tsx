import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router, useLocalSearchParams } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header } from '@/components/shared/header';
import { TimePickerSheet } from '@/components/shared/time-picker.sheet';
import { Loading } from '@/components/status-screens';
import { Button, Text } from '@/components/ui';
import { DAY_ORDER } from '@/constants/global.constants';
import { useLocaleData } from '@/hooks/common/use-locale-data';
import { useGetSchedule, useUpdateSchedule } from '@/hooks/schedule';
import { toast } from '@/providers/toaster';
import { alert } from '@/stores/use-alert-store';
import { DayCard } from '@/views/brand-profile/schedule';

import type { IWorkingDay } from '@/types/schedule.type';

const ManageScheduleScreen = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const params = useLocalSearchParams<{ brandId?: string }>();
  const brandId = params?.brandId;

  const { dayNames, dayNamesShort } = useLocaleData();

  // Fetch existing schedule
  const { data: scheduleData, isLoading: isLoadingSchedule } =
    useGetSchedule(brandId);

  // Mutations
  const { mutateAsync: updateSchedule, isPending: isUpdatingSchedule } =
    useUpdateSchedule(brandId);

  const [schedule, setSchedule] = useState<IWorkingDay[]>([]);
  const [editingState, setEditingState] = useState<{
    day: number;
    field: 'start' | 'end';
    breakId?: string; // For editing break times
  } | null>(null);

  const timePickerRef = useRef<BottomSheetModal>(null);

  const formatTime = useCallback((time?: string) => {
    if (!time) return '--:--';
    const [hours = '00', minutes = '00'] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }, []);

  const normalizeTime = (time?: string, fallback = '09:00') => {
    if (!time) return fallback;
    const [hours = '00', minutes = '00'] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  // Populate schedule when data is loaded
  useEffect(() => {
    if (scheduleData?.workingDays && scheduleData.workingDays.length > 0) {
      setSchedule(
        scheduleData.workingDays.map((day) => ({
          ...day,
          dayOfWeek: Number(day.dayOfWeek),
          startTime: normalizeTime(day.startTime, '09:00'),
          endTime: normalizeTime(day.endTime, '18:00'),
          breaks: day.breaks?.map((breakItem) => ({
            ...breakItem,
            startTime: normalizeTime(breakItem.startTime, '12:00'),
            endTime: normalizeTime(breakItem.endTime, '13:00'),
          })),
        })),
      );
    }
  }, [scheduleData]);

  // --- Actions ---
  const toggleDay = useCallback(
    (dayOfWeek: number) => {
      const defaultWorkingDay: IWorkingDay = {
        id: `new-${dayOfWeek}`,
        scheduleId: scheduleData?.id || 'temp',
        dayOfWeek,
        startTime: '09:00',
        endTime: '18:00',
        breaks: [],
        createdAt: new Date().toISOString(),
      };

      setSchedule((prev) => {
        const isActive = prev.some((day) => day.dayOfWeek === dayOfWeek);
        const next = isActive
          ? prev.filter((day) => day.dayOfWeek !== dayOfWeek)
          : [...prev, defaultWorkingDay];

        return next.sort(
          (a, b) =>
            DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek),
        );
      });

      if (editingState?.day === dayOfWeek) {
        setEditingState(null);
        timePickerRef.current?.dismiss();
      }
    },
    [editingState, scheduleData?.id],
  );

  const openTimePicker = useCallback(
    (dayOfWeek: number, field: 'start' | 'end', breakId?: string) => {
      setEditingState({ day: dayOfWeek, field, breakId });
      timePickerRef.current?.present();
    },
    [],
  );

  const handleTimeChange = useCallback(
    (time: string) => {
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
                      [editingState.field === 'start'
                        ? 'startTime'
                        : 'endTime']: time,
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
    },
    [editingState],
  );

  const addBreak = useCallback((dayOfWeek: number) => {
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
  }, []);

  const removeBreak = useCallback((dayOfWeek: number, breakId: string) => {
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
  }, []);

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
        workingDays: schedule.map((day) => ({
          dayOfWeek: day.dayOfWeek,
          startTime: day.startTime,
          endTime: day.endTime,
          breaks: day.breaks?.map((b) => ({
            startTime: b.startTime,
            endTime: b.endTime,
          })),
        })),
      };

      await updateSchedule(workingDaysPayload);
      router.back();
      toast.success({ title: t('common.success.scheduleSaved') });
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
      if (!breakItem) return '12:00';
      // Return time directly without normalization
      return editingState.field === 'start'
        ? breakItem.startTime
        : breakItem.endTime;
    }

    // Editing working day time - return directly without normalization
    return editingState.field === 'start' ? day.startTime : day.endTime;
  }, [editingState, schedule]);

  // Show loading state
  if (isLoadingSchedule) {
    return <Loading />;
  }

  return (
    <View className="main-area" style={{ paddingTop: insets.top }}>
      <Header
        title="Working Hours"
        subtitle="Manage your working hours"
        animate={false}
        variant="row"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 16,
          paddingBottom: insets.bottom + 100,
        }}
      >
        {DAY_ORDER.map((dayIndex) => {
          const dayConfig = schedule.find((s) => s.dayOfWeek === dayIndex);
          const isActive = !!dayConfig;
          const dayName = dayNames[dayIndex];

          return (
            <DayCard
              key={dayIndex}
              dayValue={dayIndex}
              label={dayName}
              config={dayConfig}
              isActive={isActive}
              onToggle={toggleDay}
              onOpenTimePicker={openTimePicker}
              onAddBreak={addBreak}
              onRemoveBreak={removeBreak}
              formatTime={formatTime}
            />
          );
        })}
      </ScrollView>

      {/* Fixed Footer */}
      <View
        style={{ paddingBottom: insets.bottom }}
        className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border/50 px-5 py-4"
      >
        <Button size="lg" onPress={handleSave} loading={isUpdatingSchedule}>
          <Text>Save Changes</Text>
        </Button>
      </View>

      <TimePickerSheet
        ref={timePickerRef}
        value={activeWorkingDayValue}
        onChange={handleTimeChange}
        title={
          editingState
            ? `${editingState.field === 'start' ? 'Open' : 'Close'} - ${
                dayNamesShort[DAY_ORDER.indexOf(editingState.day)]
              }`
            : 'Select Time'
        }
      />
    </View>
  );
};

export default ManageScheduleScreen;
