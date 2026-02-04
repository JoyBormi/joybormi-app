import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';

import { DAY_ORDER } from '@/constants/global.constants';
import { useColorScheme } from '@/hooks/common';
import { getMonthTheme } from '@/styles/calendar';

interface BookingCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  availableDays?: number[]; // [1, 2, 3, 4, 5] for Mon-Fri
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  selectedDate,
  onDateSelect,
  availableDays = DAY_ORDER, // Default as all days available
}) => {
  const { colors } = useColorScheme();
  const theme = useMemo(() => getMonthTheme(colors), [colors]);
  const today = dayjs().format('YYYY-MM-DD');

  return (
    <View className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden">
      <Calendar
        current={selectedDate || today}
        minDate={today}
        onDayPress={(day) => {
          onDateSelect(day.dateString);
        }}
        markedDates={{
          [selectedDate]: {
            selected: true,
            disableTouchEvent: true,
            selectedColor: colors.primary,
            selectedTextColor: colors.background,
          },
        }}
        theme={theme}
      />
    </View>
  );
};
