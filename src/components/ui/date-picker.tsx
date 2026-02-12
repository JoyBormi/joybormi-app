import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React, { useCallback, useEffect, useState } from 'react';
import { Platform, View } from 'react-native';

import { fromDateOnly, toDateOnly } from '@/utils/date';

interface DatePickerProps {
  value: string;
  onChange: (val: string) => void;
  minimumDate?: Date;
  maximumDate?: Date;
}

export const DatePicker = ({
  value,
  onChange,
  minimumDate,
  maximumDate,
}: DatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(() =>
    toDateOnly(value),
  );

  useEffect(() => {
    setSelectedDate(toDateOnly(value));
  }, [value]);

  const handleChange = useCallback(
    (event: DateTimePickerEvent, date?: Date) => {
      if (Platform.OS === 'android' && event.type !== 'set') return;
      if (!date) return;

      setSelectedDate(date);
      onChange(fromDateOnly(date));
    },
    [onChange],
  );

  return (
    <View className="items-center justify-center py-2">
      <DateTimePicker
        mode="date"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        value={selectedDate}
        onChange={handleChange}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
      />
    </View>
  );
};
