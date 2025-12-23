import CustomBottomSheet from '@/components/shared/bottom-sheet';
import { Button, Text } from '@/components/ui';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { forwardRef, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DatePickerSheetProps {
  value: Date;
  onChange: (date: Date) => void;
  title?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

/**
 * Date Picker Bottom Sheet Component
 * Displays a date picker in a bottom sheet
 */
export const DatePickerSheet = forwardRef<
  BottomSheetModal,
  DatePickerSheetProps
>(
  (
    { value, onChange, title = 'Select Date', minimumDate, maximumDate },
    ref,
  ) => {
    const insets = useSafeAreaInsets();
    const [selectedDate, setSelectedDate] = useState(value);

    const handleConfirm = () => {
      onChange(selectedDate);
      if (ref && 'current' in ref) {
        ref.current?.dismiss();
      }
    };

    return (
      <CustomBottomSheet
        ref={ref}
        index={0}
        snapPoints={['50%']}
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
            value={selectedDate}
            mode="date"
            display="spinner"
            onChange={(event, date) => {
              if (date) {
                setSelectedDate(date);
              }
            }}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
        </View>

        <View className="gap-3">
          <Button onPress={handleConfirm} className="bg-primary">
            <Text className="font-subtitle text-primary-foreground">
              Confirm
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
    );
  },
);

DatePickerSheet.displayName = 'DatePickerSheet';
