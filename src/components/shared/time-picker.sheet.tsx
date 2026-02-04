import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { forwardRef, useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button, Text } from '@/components/ui';
import { TimePicker } from '@/components/ui/time-picker';
import { Feedback } from '@/lib/haptics';

import { DetachedSheet } from '../bottom-sheet';

interface TimePickerSheetProps {
  value: string;
  onChange: (time: string) => void;
  title?: string;
}

/**
 * Time Picker Bottom Sheet Component
 * Displays a time picker in a bottom sheet
 */
export const TimePickerSheet = forwardRef<
  BottomSheetModal,
  TimePickerSheetProps
>(({ value, onChange, title = 'Select Time' }, ref) => {
  const [selectedTime, setSelectedTime] = useState(value);
  useEffect(() => {
    setSelectedTime(value);
  }, [value]);

  const handleConfirm = () => {
    onChange(selectedTime);
    if (ref && 'current' in ref) {
      ref.current?.dismiss();
    }
  };

  return (
    <DetachedSheet ref={ref}>
      <View className="mb-6">
        <Text className="font-heading text-foreground">{title}</Text>
      </View>

      <TimePicker value={selectedTime} onChange={setSelectedTime} />

      <View className="gap-3 flex-row mt-4 mb-6">
        <Button
          variant="outline"
          size="lg"
          className="flex-[0.35] rounded-2xl"
          onPress={() => {
            Feedback.medium();
            if (ref && 'current' in ref) {
              ref.current?.dismiss();
            }
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
});

TimePickerSheet.displayName = 'TimePickerSheet';
