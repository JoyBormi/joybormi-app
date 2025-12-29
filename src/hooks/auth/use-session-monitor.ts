import { useEffect, useRef } from 'react';
import { useMe } from './use-me';
import { useRefreshSession } from './use-refresh-session';

/**
 * Session monitor hook
 * Automatically refreshes the session before it expires
 *
 * @example
 * // In your root component or auth provider
 * useSessionMonitor();
 */
export function useSessionMonitor() {
  const { data: meData, isSuccess } = useMe();
  const { mutate: refreshSession } = useRefreshSession();
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear any existing timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    // Only set up refresh if we have session data
    if (!isSuccess || !meData?.session) {
      return;
    }

    const { expiresAt } = meData.session;
    const expiresAtDate = new Date(expiresAt);
    const now = new Date();

    // Calculate time until expiration
    const timeUntilExpiry = expiresAtDate.getTime() - now.getTime();

    // Refresh 5 minutes before expiration
    const refreshBuffer = 5 * 60 * 1000; // 5 minutes
    const timeUntilRefresh = timeUntilExpiry - refreshBuffer;

    // If session expires in less than 5 minutes, refresh immediately
    if (timeUntilRefresh <= 0) {
      console.warn('[Session Monitor] Session expiring soon, refreshing now');
      refreshSession();
      return;
    }

    // Schedule refresh
    console.warn('[Session Monitor] Scheduling refresh in', {
      minutes: Math.floor(timeUntilRefresh / 60000),
      expiresAt,
    });

    refreshTimerRef.current = setTimeout(() => {
      console.warn('[Session Monitor] Refreshing session');
      refreshSession();
    }, timeUntilRefresh);

    // Cleanup on unmount
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [isSuccess, meData, refreshSession]);
}
