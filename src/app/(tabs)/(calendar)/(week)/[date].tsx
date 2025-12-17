import { useColorScheme } from '@/hooks/common';
import { getTimelineTheme } from '@/styles/calendar';
import { formatMonth } from '@/utils/date';
import { getDate } from '@/utils/helpers';
import { TimeEvent, TimelineEvent } from '@/views/calendars';

import dayjs from 'dayjs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { groupBy } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { Alert, View } from 'react-native';
import {
  CalendarProvider,
  DateData,
  TimelineList,
  TimelineProps,
  WeekCalendar,
} from 'react-native-calendars';
import { UpdateSources } from 'react-native-calendars/src/expandableCalendar/commons';
import { PackedEvent } from 'react-native-calendars/src/timeline/EventBlock';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* ---------------------------------- */
/* EVENTS */
/* ---------------------------------- */

const baseEvents: TimeEvent[] = [
  {
    id: '1',
    start: `${getDate()} 00:00:00`,
    end: `${getDate()} 01:05:00`,
    title: 'Night event',
    color: 'purple',
  },
  {
    id: '2',
    start: `${getDate()} 09:00:00`,
    end: `${getDate()} 10:00:00`,
    title: 'Morning',
    color: 'gray',
  },
  {
    id: '3',
    start: `${getDate()} 13:00:00`,
    end: `${getDate()} 14:30:00`,
    title: 'Afternoon',
    color: 'yellow',
  },
  {
    id: '4',
    start: `${getDate()} 22:30:00`,
    end: `${getDate()} 23:30:00`,
    title: 'Late night',
    color: 'red',
  },
  {
    id: '5',
    start: `${getDate()} 23:30:00`,
    end: `${getDate()} 23:59:59`,
    title: 'Night event',
    color: 'purple',
  },
];

/* ---------------------------------- */
/* DUPLICATE EVENTS FOR LOOPING */
/* ---------------------------------- */

const loopedEvents: TimeEvent[] = [
  ...baseEvents,
  ...baseEvents.map((e) => ({
    ...e,
    id: `${e.id}-next`,
    start: dayjs(e.start).add(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
    end: dayjs(e.end).add(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
  })),
];

/* ---------------------------------- */
/* SCREEN */
/* ---------------------------------- */

export default function TimelineCalendarScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { date } = useLocalSearchParams();
  const { colors, isDarkColorScheme } = useColorScheme();
  const theme = useMemo(() => getTimelineTheme(colors), [colors]);

  /* group by date */
  const eventsByDate = useMemo(
    () => groupBy(loopedEvents, (e) => dayjs(e.start).format('YYYY-MM-DD')),
    [],
  );

  /* render event — NO key */
  const renderEvent = useCallback(
    (event: PackedEvent) => <TimelineEvent {...event} />,
    [],
  );

  const timelineProps = useMemo<Partial<TimelineProps>>(
    () => ({
      format24h: true,
      renderEvent,
      overlapEventsSpacing: 4,
      rightEdgeSpacing: 8,
      start: 0,
      end: 25,
      theme,
      scrollToFirst: false,
      scrollToNow: false,
      styles: {
        timelineContainer: {
          paddingVertical: 24,
          marginBottom: insets.bottom,
        },
      },
      onEventPress: (event) => Alert.alert(event.title),
    }),
    [renderEvent, theme, insets.bottom],
  );

  /* month sync */
  const onMonthChange = useCallback(
    (date: DateData, _src: UpdateSources) => {
      router.setParams({
        month: formatMonth(date.dateString),
      });
    },
    [router],
  );

  return (
    <CalendarProvider
      date={date as string}
      onMonthChange={onMonthChange}
      theme={theme}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
        key={isDarkColorScheme ? 'dark' : 'light'}
      >
        <WeekCalendar
          initialDate={date as string}
          hideArrows
          firstDay={1}
          renderHeader={() => null}
          theme={theme}
        />
        <TimelineList events={eventsByDate} timelineProps={timelineProps} />
        <View style={{ height: insets.bottom }} />
      </View>
    </CalendarProvider>
  );
}
