import { BottomSheetModal } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

import { DetachedSheet } from '@/components/bottom-sheet';
import { Button, DatePicker, Text } from '@/components/ui';
import { Feedback } from '@/lib/haptics';
import { normalizeDateValue } from '@/utils/date';

interface DatePickerSheetProps {
  value: string;
  onChange: (date: string) => void;
  title?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

export const DatePickerSheet = forwardRef<
  BottomSheetModal,
  DatePickerSheetProps
>(
  (
    { value, onChange, title = 'Select Date', minimumDate, maximumDate },
    ref,
  ) => {
    const [selectedDate, setSelectedDate] = useState(() =>
      normalizeDateValue(value),
    );

    useEffect(() => {
      setSelectedDate(normalizeDateValue(value));
    }, [value]);

    const resolvedMaximumDate = useMemo(() => {
      if (maximumDate) return maximumDate;
      return dayjs().add(10, 'year').toDate();
    }, [maximumDate]);

    const handleDismiss = () => {
      if (ref && 'current' in ref) {
        ref.current?.dismiss();
      }
    };

    const handleConfirm = () => {
      onChange(selectedDate);
      handleDismiss();
    };

    return (
      <DetachedSheet ref={ref}>
        <View className="mb-6">
          <Text className="font-heading text-foreground">{title}</Text>
        </View>

        <DatePicker
          value={selectedDate}
          onChange={setSelectedDate}
          minimumDate={minimumDate}
          maximumDate={resolvedMaximumDate}
        />

        <View className="gap-3 flex-row mt-4 mb-6">
          <Button
            variant="outline"
            size="lg"
            className="flex-[0.35] rounded-2xl"
            onPress={() => {
              Feedback.medium();
              handleDismiss();
            }}
          >
            <Text>Cancel</Text>
          </Button>
          <Button
            variant="default"
            size="lg"
            className="flex-[0.65] rounded-2xl"
            onPress={() => {
              Feedback.success();
              handleConfirm();
            }}
          >
            <Text>Confirm</Text>
          </Button>
        </View>
      </DetachedSheet>
    );
  },
);

DatePickerSheet.displayName = 'DatePickerSheet';
