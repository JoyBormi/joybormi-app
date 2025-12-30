import { useRef } from 'react';

export function useYMonthScroll() {
  const lastMonth = useRef<number | null>(null);

  const onVisibleMonthsChange = (months: { year: number; month: number }[]) => {
    if (!months?.length) return;
    const current = months[0];
    const currentIndex = current.year * 12 + current.month;

    lastMonth.current = currentIndex;
  };

  return { onVisibleMonthsChange };
}
