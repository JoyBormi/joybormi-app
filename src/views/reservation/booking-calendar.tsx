import dayjs from 'dayjs';
import React from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';

interface BookingCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  availableDays?: number[]; // [1, 2, 3, 4, 5] for Mon-Fri
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  selectedDate,
  onDateSelect,
  availableDays = [1, 2, 3, 4, 5, 6, 0], // Default as all days available
}) => {
  const today = dayjs().format('YYYY-MM-DD');

  return (
    <View className="bg-card rounded-3xl p-2 border border-border/50 shadow-sm overflow-hidden">
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
            selectedColor: '#1A1A1A', // Usually primary color, I'll use a dark neutral for premium feel
            selectedTextColor: '#FFFFFF',
          },
        }}
        theme={{
          backgroundColor: 'transparent',
          calendarBackground: 'transparent',
          textSectionTitleColor: '#9CA3AF',
          selectedDayBackgroundColor: '#1A1A1A',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#3B82F6',
          dayTextColor: '#1F2937',
          textDisabledColor: '#D1D5DB',
          dotColor: '#3B82F6',
          selectedDotColor: '#ffffff',
          arrowColor: '#1A1A1A',
          monthTextColor: '#111827',
          indicatorColor: '#1A1A1A',
          textDayFontFamily: 'System',
          textMonthFontFamily: 'System',
          textDayHeaderFontFamily: 'System',
          textDayFontWeight: '500',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '400',
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 12,
        }}
      />
    </View>
  );
};
