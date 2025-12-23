import CustomBottomSheet from '@/components/shared/bottom-sheet';
import { Button, Text } from '@/components/ui';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { forwardRef, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TimePickerSheetProps {
  value: Date;
  onChange: (time: Date) => void;
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

  const handleConfirm = () => {
    onChange(selectedTime);
    if (ref && 'current' in ref) {
      ref.current?.dismiss();
    }
  };

  return (
    <CustomBottomSheet
      ref={ref}
      index={0}
      snapPoints={['45%']}
      bottomSheetViewConfig={{
        style: {
          paddingBottom: insets.bottom + 20,
        },
      }}
    >
      <View className="mb-6">
        <Text className="font-heading text-xl text-foreground">{title}</Text>
      </View>

      <View className="items-center mb-6">
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display="spinner"
          onChange={(event, time) => {
            if (time) {
              setSelectedTime(time);
            }
          }}
        />
      </View>

      <View className="gap-3">
        <Button onPress={handleConfirm} className="bg-primary">
          <Text className="font-subtitle text-primary-foreground">Confirm</Text>
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
  );
});

TimePickerSheet.displayName = 'TimePickerSheet';
