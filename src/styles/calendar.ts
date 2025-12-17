import { Theme } from 'react-native-calendars/src/types';
import { ThemeHex } from './themes';

export const getMonthTheme = (colors: ThemeHex['dark']['colors']): Theme => {
  return {
    calendarBackground: colors.background,
    textSectionTitleColor: colors.text,
    dayTextColor: colors.text,
    todayTextColor: colors.primary,
    selectedDayTextColor: colors.text,
    selectedDayBackgroundColor: colors.primary,
    dotColor: colors.primary,
    selectedDotColor: colors.primary,
    textDisabledColor: colors.border,
    monthTextColor: colors.primary,
    textMonthFontWeight: '600',
    textMonthFontSize: 14,
    textMonthFontFamily: 'Montserrat-Bold',
    textDayFontFamily: 'Montserrat-Regular',
    todayButtonFontFamily: 'Montserrat-Regular',
    todayButtonFontWeight: '600',
    todayButtonFontSize: 14,
    todayButtonPosition: 'center',
    textDayStyle: {
      fontFamily: 'Montserrat-Regular',
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
    },
  };
};

export const getTimelineTheme = (colors: ThemeHex['dark']['colors']): Theme => {
  return {
    calendarBackground: colors.background,
    textSectionTitleColor: colors.text,
    dayTextColor: colors.text,
    todayTextColor: colors.primary,
    selectedDayTextColor: colors.background,
    selectedDayBackgroundColor: colors.primary,
    todayDotColor: colors.primary,
    dotColor: colors.primary,
    selectedDotColor: colors.background,
    textDisabledColor: colors.border,
    weekVerticalMargin: 6,
    monthTextColor: colors.primary,
    textMonthFontWeight: '700',
    textMonthFontSize: 18,
    textMonthFontFamily: 'Montserrat-Bold',
    todayButtonPosition: 'center',
    line: {
      borderColor: colors.border,
      borderWidth: 0.5,
    },
    verticalLine: {
      borderColor: colors.border,
      borderWidth: 0.5,
    },
    timeLabel: {
      fontFamily: 'Montserrat-Regular',
      fontSize: 11,
      color: colors.text,
      opacity: 0.7,
    },
    timelineContainer: {
      backgroundColor: colors.background,
    },
    event: {
      borderRadius: 4,
      paddingHorizontal: 1.5,
      paddingVertical: 0.5,
      overflow: 'hidden',
      border: 1,
    },
  };
};

export const TIMELINE_MARK_COLORS = {
  light: {
    red: '#ef4444', // Modern red
    green: '#10b981', // Modern green
    blue: '#3b82f6', // Modern blue
    yellow: '#f59e0b', // Modern amber/yellow
    orange: '#f97316', // Modern orange
    purple: '#a855f7', // Modern purple
    pink: '#ec4899', // Modern pink
    teal: '#14b8a6', // Teal
    indigo: '#6366f1', // Indigo
    gray: '#6b7280', // Modern gray
  },
  dark: {
    red: '#f87171', // Lighter red for dark mode
    green: '#34d399', // Lighter green for dark mode
    blue: '#60a5fa', // Lighter blue for dark mode
    yellow: '#fbbf24', // Lighter amber/yellow for dark mode
    orange: '#fb923c', // Lighter orange for dark mode
    purple: '#c084fc', // Lighter purple for dark mode
    pink: '#f472b6', // Lighter pink for dark mode
    teal: '#2dd4bf', // Lighter teal for dark mode
    indigo: '#818cf8', // Lighter indigo for dark mode
    gray: '#9ca3af', // Lighter gray for dark mode
  },
};

export type TimelineColorName = keyof typeof TIMELINE_MARK_COLORS.light;
