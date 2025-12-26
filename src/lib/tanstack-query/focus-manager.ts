import { focusManager } from '@tanstack/react-query';
import { AppState, AppStateStatus, Platform } from 'react-native';

/**
 * Integrates React Query's focusManager with React Native's AppState
 *
 * This setup enables automatic query refetching when the app returns to the foreground.
 * When a user switches away from the app and comes back, any stale queries will be
 * automatically refetched to ensure fresh data.
 *
 * How it works:
 * 1. Listens to React Native's AppState changes (active, background, inactive)
 * 2. When AppState becomes 'active', notifies React Query to refetch stale queries
 * 3. Only applies to native platforms (iOS/Android), not web
 *
 * This is called once during app initialization in the RootProvider.
 *
 * @example
 * In your root provider:
 * useEffect(() => {
 *   setupFocusManager();
 * }, []);
 */
export function setupFocusManager(): void {
  focusManager.setEventListener((handleFocus) => {
    // Subscribe to AppState changes
    const subscription = AppState.addEventListener(
      'change',
      (status: AppStateStatus) => {
        // Only handle focus on native platforms (not web)
        if (Platform.OS !== 'web') {
          // Notify React Query when app becomes active (foreground)
          handleFocus(status === 'active');
        }
      },
    );

    // Cleanup function: remove listener when component unmounts
    return () => {
      subscription.remove();
    };
  });
}
