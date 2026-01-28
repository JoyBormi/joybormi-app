import { BottomSheetModal } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { groupBy } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View } from 'react-native';
import {
  CalendarProvider,
  DateData,
  TimelineList,
  TimelineProps,
  WeekCalendar,
} from 'react-native-calendars';
import { UpdateSources } from 'react-native-calendars/src/expandableCalendar/commons';
import { PackedEvent } from 'react-native-calendars/src/timeline/EventBlock';

import { useColorScheme } from '@/hooks/common';
import {
  getTimelineTheme,
  TIMELINE_MARK_COLORS,
  TimelineColorName,
} from '@/styles/calendar';
import { formatMonth } from '@/utils/date';
import { getDate } from '@/utils/helpers';
import { TimeEvent, TimelineEvent } from '@/views/calendars';
import { Reservation, ReservationBottomSheet } from '@/views/reservation';

/* ---------------------------------- */
/* HELPER FUNCTIONS */
/* ---------------------------------- */

const createLoopedEvents = (events: TimeEvent[]): TimeEvent[] => [
  ...events,
  ...events.map((e) => ({
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
  const { date } = useLocalSearchParams();
  const { colors, isDarkColorScheme } = useColorScheme();
  const theme = useMemo(() => getTimelineTheme(colors), [colors]);

  const initialEvents: TimeEvent[] = [
    /* -------- NIGHT / EARLY MORNING -------- */

    {
      id: '1',
      start: `${getDate()} 00:00:00`,
      end: `${getDate()} 01:05:00`,
      title: 'Night focus',
      summary: 'Deep focus block during quiet hours',
      color: 'purple' as TimelineColorName,
    },
    {
      id: '1a',
      start: `${getDate()} 00:30:00`,
      end: `${getDate()} 01:00:00`,
      title: 'Quick note',
      summary: 'Interrupted by an idea',
      color: 'gray' as TimelineColorName,
    },

    /* -------- MORNING CLUSTER -------- */

    {
      id: '2',
      start: `${getDate()} 09:00:00`,
      end: `${getDate()} 10:00:00`,
      title: 'Morning planning',
      color: 'gray' as TimelineColorName,
    },
    {
      id: '2a',
      start: `${getDate()} 09:15:00`,
      end: `${getDate()} 09:45:00`,
      title: 'Standup call',
      color: 'yellow' as TimelineColorName,
    },
    {
      id: '2b',
      start: `${getDate()} 09:30:00`,
      end: `${getDate()} 10:15:00`,
      title: 'Review notes',
      summary: 'Overlap with planning',
      color: 'purple' as TimelineColorName,
    },

    /* -------- MIDDAY / AFTERNOON DENSITY -------- */

    {
      id: '3',
      start: `${getDate()} 13:00:00`,
      end: `${getDate()} 14:30:00`,
      title: 'Deep work',
      color: 'yellow' as TimelineColorName,
    },
    {
      id: '3a',
      start: `${getDate()} 13:10:00`,
      end: `${getDate()} 13:40:00`,
      title: 'Slack replies',
      color: 'gray' as TimelineColorName,
    },
    {
      id: '3b',
      start: `${getDate()} 13:30:00`,
      end: `${getDate()} 14:00:00`,
      title: 'Design sync',
      summary: 'Overlapping meeting',
      color: 'red' as TimelineColorName,
    },
    {
      id: '3c',
      start: `${getDate()} 14:00:00`,
      end: `${getDate()} 14:45:00`,
      title: 'Implementation',
      color: 'purple' as TimelineColorName,
    },

    /* -------- EVENING -------- */

    {
      id: '4',
      start: `${getDate()} 18:00:00`,
      end: `${getDate()} 19:00:00`,
      title: 'Workout',
      color: 'green' as TimelineColorName,
    },
    {
      id: '4a',
      start: `${getDate()} 18:30:00`,
      end: `${getDate()} 18:50:00`,
      title: 'Phone call',
      color: 'gray' as TimelineColorName,
    },

    /* -------- LATE NIGHT STACK -------- */

    {
      id: '5',
      start: `${getDate()} 22:30:00`,
      end: `${getDate()} 23:30:00`,
      title: 'Late night work',
      color: 'red' as TimelineColorName,
    },
    {
      id: '5a',
      start: `${getDate()} 22:45:00`,
      end: `${getDate()} 23:15:00`,
      title: 'Bug fix',
      summary: 'Hotfix overlapping main task',
      color: 'purple' as TimelineColorName,
    },
    {
      id: '5b',
      start: `${getDate()} 23:10:00`,
      end: `${getDate()} 23:59:59`,
      title: 'Wrap up',
      color: 'gray' as TimelineColorName,
    },
  ];

  /* State for events */
  const [events] = useState<TimeEvent[]>(initialEvents);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const reservationSheetRef = useRef<BottomSheetModal>(null);

  /* Get theme-aware color */
  const getEventColor = useCallback(
    (colorName?: TimelineColorName | string) => {
      if (!colorName) return colors.card;
      const colorTheme = isDarkColorScheme ? 'dark' : 'light';
      return (
        TIMELINE_MARK_COLORS[colorTheme][colorName as TimelineColorName] ??
        colors.card
      );
    },
    [isDarkColorScheme, colors.card],
  );

  /* Create looped events with theme-aware colors */
  const loopedEvents = useMemo(() => createLoopedEvents(events), [events]);

  /* Map events with actual color values */
  const eventsWithColors = useMemo(
    () =>
      loopedEvents.map((event) => ({
        ...event,
        color: getEventColor(event.color),
      })),
    [loopedEvents, getEventColor],
  );

  /* Group by date */
  const eventsByDate = useMemo(
    () => groupBy(eventsWithColors, (e) => dayjs(e.start).format('YYYY-MM-DD')),
    [eventsWithColors],
  );

  /* render event — NO key */
  const renderEvent = useCallback(
    (event: PackedEvent) => <TimelineEvent {...event} />,
    [],
  );

  const timelineProps = useMemo<Partial<TimelineProps>>(
    () => ({
      keyExtractor: (item: TimeEvent) => item.id,
      format24h: true,
      renderEvent,
      overlapEventsSpacing: -1,
      rightEdgeSpacing: 0,
      start: 0,
      end: 25,
      theme,
      scrollToFirst: false,
      scrollToNow: false,
      onEventPress: (event) => {
        const eventId = event.id?.toString() ?? 'event';
        const reservation: Reservation = {
          uuid: eventId,
          title: event.title ?? 'Reservation',
          start_time: dayjs(event.start).format('YYYY-MM-DD HH:mm:ss'),
          end_time: dayjs(event.end).format('YYYY-MM-DD HH:mm:ss'),
          avatar: `https://i.pravatar.cc/150?u=${eventId}`,
          status: 'confirmed',
          summary: event.summary ?? 'Calendar reservation details',
          brand_name: 'Brand Name',
          service: 'Service',
          worker_name: 'Worker Name',
          color: typeof event.color === 'string' ? event.color : '',
        };
        setSelectedReservation(reservation);
      },
    }),
    [renderEvent, theme],
  );

  /* Month sync */
  const onMonthChange = useCallback(
    (date: DateData, _src: UpdateSources) => {
      router.setParams({
        month: formatMonth(date.dateString),
      });
    },
    [router],
  );

  const handleReservationClose = useCallback(() => {
    reservationSheetRef.current?.dismiss();
    setSelectedReservation(null);
  }, []);

  useEffect(() => {
    if (selectedReservation) {
      reservationSheetRef.current?.present();
    }
  }, [selectedReservation]);

  return (
    <CalendarProvider
      date={date as string}
      onMonthChange={onMonthChange}
      theme={theme}
    >
      <View
        className="flex-1 bg-background"
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
      </View>
      <ReservationBottomSheet
        ref={reservationSheetRef}
        reservation={selectedReservation}
        onClose={handleReservationClose}
      />
    </CalendarProvider>
  );
}
