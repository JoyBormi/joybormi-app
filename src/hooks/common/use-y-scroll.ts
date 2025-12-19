// hooks/useYScroll.ts
import { useScrollStore } from '@/stores/use-scroll-store';
import { useCallback, useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export function useYScroll(threshold = 1) {
  const lastY = useRef(0);
  const { setScrollingDown } = useScrollStore();

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      const diff = y - lastY.current;

      if (diff > threshold) setScrollingDown(true);
      else if (diff < -threshold) setScrollingDown(false);

      lastY.current = y;
    },
    [threshold, setScrollingDown],
  );

  return { onScroll };
}

export function useYMonthScroll() {
  const lastMonth = useRef<number | null>(null);
  const setScrollingDown = useScrollStore((s) => s.setScrollingDown);

  const onVisibleMonthsChange = (months: { year: number; month: number }[]) => {
    if (!months?.length) return;
    const current = months[0];
    const currentIndex = current.year * 12 + current.month;

    if (lastMonth.current !== null) {
      setScrollingDown(currentIndex > lastMonth.current);
    }

    lastMonth.current = currentIndex;
  };

  return { onVisibleMonthsChange };
}
