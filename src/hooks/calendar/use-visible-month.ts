/* eslint-disable @typescript-eslint/no-explicit-any */

import dayjs from 'dayjs';
import { useNavigation } from 'expo-router';
import { useCallback, useLayoutEffect } from 'react';

import { useYMonthScroll } from '@/hooks/common';

type Month = {
  dateString: string;
  day: number;
  month: number;
  timestamp: number;
  year: number;
};

export const useHeaderMonthControls = (calendarRef: React.RefObject<any>) => {
  const navigation = useNavigation();
  const { onVisibleMonthsChange } = useYMonthScroll();

  // Pass ref once
  useLayoutEffect(() => {
    navigation.setOptions({
      calendarRef,
    });
  }, [navigation, calendarRef]);

  // Update month + year on scroll
  return useCallback(
    (months: Month[]) => {
      if (!months.length) return;

      onVisibleMonthsChange?.(months);

      navigation.setOptions({
        title: dayjs(months[0].dateString).format('MMMM'),
        headerBackTitle: months[0].year.toString(),
      });
    },
    [navigation, onVisibleMonthsChange],
  );
};
