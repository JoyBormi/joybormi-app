import { onlineManager } from '@tanstack/react-query';
import * as Network from 'expo-network';

/**
 * Integrates React Query's onlineManager with Expo Network's network state
 *
 * This setup enables React Query to automatically pause and resume queries based on
 * the device's network connectivity status.
 *
 * How it works:
 * 1. Listens to network state changes using expo-network
 * 2. When device goes offline, React Query pauses all queries
 * 3. When device comes back online, React Query resumes and refetches stale queries
 * 4. Prevents unnecessary network requests when there's no connectivity
 *
 * This is called once during app initialization in the RootProvider.
 *
 * @example
 * // In your root provider:
 * useEffect(() => {
 *   setupOnlineManager();
 * }, []);
 */
export function setupOnlineManager(): void {
  onlineManager.setEventListener((setOnline) => {
    // Subscribe to network state changes
    // expo-network will notify us whenever connectivity changes
    const eventSubscription = Network.addNetworkStateListener((state) => {
      // Update React Query's online status
      // !! converts to boolean (null/undefined become false)
      setOnline(!!state.isConnected);
    });

    // Return cleanup function to remove the listener
    return eventSubscription.remove;
  });
}
