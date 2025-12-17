import { useHeaderMonthControls } from '@/hooks/calendar';
import { useColorScheme, useLanguage } from '@/hooks/common';
import { getMonthTheme } from '@/styles/calendar';
import { setCalendarLocale } from '@/utils/month-names';
import { RenderHeader } from '@/views/calendars/month/header';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { Locale } from 'i18n.config';
import { debounce } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View } from 'react-native';
import { CalendarList, DateData, LocaleConfig } from 'react-native-calendars';

const initialDate = dayjs().format('YYYY-MM-DD');

type MarkedDateProps = {
  marked: boolean;
  dotColor: string;
  selected: boolean;
  selectedTextColor: string;
  disableTouchEvent?: boolean;
  selectedColor?: string;
};

// fake dynamic dates (replace with backend later)
const dynamicEvents = [
  dayjs().add(1, 'week').format('YYYY-MM-DD'),
  dayjs().add(3, 'week').format('YYYY-MM-DD'),
  dayjs().add(3, 'week').format('YYYY-MM-DD'),
  dayjs().add(3, 'week').format('YYYY-MM-DD'),
  dayjs().add(1, 'month').format('YYYY-MM-DD'),
];

const MonthScreen = () => {
  const router = useRouter();
  const calendarRef = useRef(null);
  const { currentLanguage } = useLanguage();
  const { colors, isDarkColorScheme } = useColorScheme();
  const [renderVersion, setRenderVersion] = useState<number>(0);
  const theme = useMemo(() => getMonthTheme(colors), [colors]);
  const monthControlsCallback = useHeaderMonthControls(calendarRef);

  const handleVisibleMonthsChange = useMemo(
    () => debounce(monthControlsCallback, 100),
    [monthControlsCallback],
  );

  const [selected, setSelected] = useState(initialDate);

  const marked = useMemo(() => {
    const entries: Record<string, MarkedDateProps> = {};
    for (const date of dynamicEvents) {
      entries[date] = {
        marked: true,
        dotColor: colors.primary,
        selected: selected === date,
        selectedTextColor: colors.text,
      };
    }

    entries[selected] = {
      ...(entries[selected] || {}),
      selected: true,
      disableTouchEvent: true,
      selectedColor: colors.primary,
      selectedTextColor: colors.text,
    };

    return entries;
  }, [selected, colors.primary, colors.text]);

  const onDayPress = useCallback(
    (day: DateData) => {
      setSelected(day.dateString);
      router.push(`/(calendar)/(week)/${day.dateString}`);
      router.setParams({
        hideTabBarInWeek: 'true',
      });
    },
    [router],
  );

  // Locale updates
  useEffect(() => {
    setCalendarLocale(currentLanguage as Locale);
    LocaleConfig.defaultLocale = currentLanguage;
    setRenderVersion((prev) => prev + 1);
  }, [currentLanguage]);

  // Force refresh when theme changes
  useEffect(() => {
    setRenderVersion((prev) => prev + 1);
  }, [currentLanguage, colors, isDarkColorScheme]);

  const calendarKey = useMemo(
    () => `${currentLanguage}-${isDarkColorScheme}-${renderVersion}`,
    [currentLanguage, isDarkColorScheme, renderVersion],
  );

  const calendar = useMemo(
    () => (
      <CalendarList
        ref={calendarRef}
        key={calendarKey}
        id="month-calendar"
        testID="month-calendar"
        current={initialDate}
        futureScrollRange={2}
        pastScrollRange={2}
        firstDay={1}
        onDayPress={onDayPress}
        markedDates={marked}
        onVisibleMonthsChange={handleVisibleMonthsChange}
        theme={theme}
        extraData={selected} // only depends on selected
        renderHeader={(date) => (
          <RenderHeader date={date} locale={currentLanguage} />
        )}
        hideDayNames
        calendarHeight={260}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={10}
        initialNumToRender={10}
        bounces={false}
        scrollEventThrottle={50}
        maintainVisibleContentPosition={{
          minIndexForVisible: 1,
        }}
      />
    ),
    [
      calendarKey,
      handleVisibleMonthsChange,
      currentLanguage,
      marked,
      onDayPress,
      selected,
      theme,
    ],
  );

  return (
    <View
      className="safe-area"
      key={calendarKey}
      style={{ backgroundColor: colors.background }}
    >
      {calendar}
    </View>
  );
};
export default MonthScreen;
