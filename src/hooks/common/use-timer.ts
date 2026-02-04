import { useCallback, useEffect, useRef, useState } from 'react';

interface TimerReturn {
  seconds: number;
  formatted: string;
  hasStarted: boolean;
  start: (duration: number) => void;
  reset: () => void;
}

export const useTimer = (): TimerReturn => {
  const [seconds, setSeconds] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback((duration: number) => {
    setSeconds(duration);
    setHasStarted(true);
  }, []);

  const reset = useCallback(() => {
    setSeconds(0);
    setHasStarted(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (seconds <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return undefined;
    }

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [seconds]);

  const formatted = useCallback(() => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [seconds])();

  return {
    seconds,
    formatted,
    hasStarted,
    start,
    reset,
  };
};
