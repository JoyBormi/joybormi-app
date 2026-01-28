import { useEffect, useRef } from 'react';

import { useUserStore } from '@/stores';

import { useMe } from './use-me';
import { useRefreshSession } from './use-refresh-session';

/**
 * Session monitor hook
 * Automatically refreshes the session before it expires
 *
 * @example
 * useSessionMonitor();
 */
export function useSessionMonitor() {
  const { isLoggedIn, setUser } = useUserStore();
  const { mutate: refreshSession } = useRefreshSession();
  const { data: meData, isSuccess, isError } = useMe({ enabled: isLoggedIn });
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRefreshingRef = useRef(false);

  const expiresAt = meData?.session?.expiresAt;

  useEffect(() => {
    // Only run session monitor for logged-in users
    if (!isLoggedIn) {
      return;
    }

    // Clear any existing timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    // Only set up refresh if we have session data
    if (!isSuccess || isError || !expiresAt) {
      return;
    }

    const expiresAtDate = new Date(expiresAt);
    const now = new Date();

    // Calculate time until expiration
    const timeUntilExpiry = expiresAtDate.getTime() - now.getTime();

    // Refresh 5 minutes before expiration
    const refreshBuffer = 5 * 60 * 1000; // 5 minutes
    const timeUntilRefresh = timeUntilExpiry - refreshBuffer;

    // If session expires in less than 5 minutes, refresh immediately
    if (timeUntilRefresh <= 0) {
      if (isRefreshingRef.current) {
        return;
      }
      console.warn('[Session Monitor] Session expiring soon, refreshing now');
      isRefreshingRef.current = true;
      refreshSession(undefined, {
        onSettled: () => {
          isRefreshingRef.current = false;
        },
      });
      if (meData?.user) {
        setUser(meData.user);
      }
      return;
    }

    // Schedule refresh
    console.warn('[Session Monitor] Scheduling refresh in', {
      minutes: Math.floor(timeUntilRefresh / 60000),
      expiresAt,
    });

    refreshTimerRef.current = setTimeout(() => {
      if (isRefreshingRef.current) {
        return;
      }
      console.warn('[Session Monitor] Refreshing session');
      isRefreshingRef.current = true;
      refreshSession(undefined, {
        onSettled: () => {
          isRefreshingRef.current = false;
        },
      });
      if (meData?.user) {
        setUser(meData.user);
      }
    }, timeUntilRefresh);

    // Cleanup on unmount
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [
    isLoggedIn,
    isSuccess,
    isError,
    expiresAt,
    refreshSession,
    setUser,
    meData?.user,
  ]);
}
