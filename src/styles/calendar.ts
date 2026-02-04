import { Theme } from 'react-native-calendars/src/types';

import { THEMES_HEX } from './themes';

type ThemeHex = typeof THEMES_HEX;

export const getMonthTheme = (colors: ThemeHex['dark']['colors']): Theme => ({
  calendarBackground: colors.background,

  backgroundColor: colors.background,

  // Month header
  monthTextColor: colors.text,
  textMonthFontFamily: 'Montserrat-Bold',
  textMonthFontSize: 15,
  textMonthFontWeight: '700',

  // Weekday labels
  textSectionTitleColor: colors.muted,
  textDayHeaderFontFamily: 'Montserrat-Medium',
  textDayHeaderFontSize: 11,
  textDayHeaderFontWeight: '500',

  // Days
  dayTextColor: colors.text,
  textDisabledColor: colors.muted,

  // Today
  todayTextColor: colors.primary,

  // Selected day
  selectedDayBackgroundColor: colors.primary,
  selectedDayTextColor: colors.text,

  // Dots
  dotColor: colors.border,
  selectedDotColor: colors.background,

  textDayStyle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  arrowColor: colors.text,
});

export const getTimelineTheme = (colors: ThemeHex['dark']['colors']): Theme => {
  return {
    calendarBackground: colors.background,
    textSectionTitleColor: colors.text,
    dayTextColor: colors.text,
    todayTextColor: colors.primary,
    selectedDayTextColor: colors.text,
    selectedDayBackgroundColor: colors.primary,
    todayDotColor: colors.primary,
    dotColor: colors.border,
    selectedDotColor: colors.background,
    textDisabledColor: colors.border,
    weekVerticalMargin: 6,
    monthTextColor: colors.text,
    textMonthFontWeight: '700',
    textMonthFontSize: 16,
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
      borderRadius: 8,
      paddingHorizontal: 2,
      paddingVertical: 1,
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
