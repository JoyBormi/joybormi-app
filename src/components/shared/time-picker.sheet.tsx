import {
  BottomSheetModal,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import React, { forwardRef, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CustomBottomSheet from '@/components/shared/bottom-sheet';
import { Button, Text } from '@/components/ui';
import { TimePicker } from '@/components/ui/time-picker';
import { Feedback } from '@/lib/haptics';

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
  const insets = useSafeAreaInsets();
  const [selectedTime, setSelectedTime] = useState(value);
  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 150,
  });

  const handleConfirm = () => {
    onChange(selectedTime);
    if (ref && 'current' in ref) {
      ref.current?.dismiss();
    }
  };

  return (
    <CustomBottomSheet
      ref={ref}
      detached
      index={0}
      bottomInset={insets.bottom}
      animationConfigs={animationConfigs}
      style={{
        paddingHorizontal: 12,
      }}
      bottomSheetViewConfig={{
        className: 'rounded-b-3xl pb-6',
      }}
    >
      <View className="mb-6">
        <Text className="font-heading text-xl text-foreground">{title}</Text>
      </View>

      <TimePicker value={selectedTime} onChange={setSelectedTime} />

      <View className="gap-3 flex-row mt-4">
        <Button
          variant="outline"
          className="flex-[0.3] b h-14 rounded-2xl"
          onPress={() => {
            Feedback.medium();
            if (ref && 'current' in ref) {
              ref.current?.dismiss();
            }
          }}
        >
          <Text className="text-foreground font-subtitle text-base">
            Cancel
          </Text>
        </Button>
        <Button
          variant="default"
          className="flex-[0.7] b h-14 rounded-2xl"
          onPress={() => {
            Feedback.success();
            handleConfirm();
          }}
        >
          <Text className="text-white font-subtitle text-base">Confirm</Text>
        </Button>
      </View>
    </CustomBottomSheet>
  );
});

TimePickerSheet.displayName = 'TimePickerSheet';
