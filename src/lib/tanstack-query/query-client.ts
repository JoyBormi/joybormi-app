import { QueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { ApiError } from '../agent';

/**
 * Determines if an error should be retried
 * Don't retry client errors (4xx) except 408 (Request Timeout) and 429 (Too Many Requests)
 */
const shouldRetry = (failureCount: number, error: unknown): boolean => {
  if (error instanceof ApiError) {
    // Don't retry client errors (4xx) except specific cases
    if (error.status >= 400 && error.status < 500) {
      // Retry these specific client errors
      if (error.status === 408 || error.status === 429) {
        return failureCount < 3;
      }
      // Don't retry other client errors (400, 401, 403, 404, etc.)
      return false;
    }
    // Retry server errors (5xx) and network errors
    return failureCount < 3;
  }
  // Retry unknown errors
  return failureCount < 3;
};

/**
 * Global QueryClient configuration with centralized error and success handling
 * All queries and mutations inherit these defaults
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes - data is considered fresh for this duration
      staleTime: 5 * 60 * 1000,

      // Cache time: 10 minutes - unused data stays in cache
      gcTime: 10 * 60 * 1000,

      // Retry failed requests with smart retry logic
      retry: shouldRetry,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch on window focus (managed by focusManager)
      refetchOnWindowFocus: true,

      // Refetch on reconnect (managed by onlineManager)
      refetchOnReconnect: true,

      // Don't refetch on mount if data is fresh
      refetchOnMount: false,

      // Network mode: online-first, fallback to cache when offline
      networkMode: 'online',
    },
    mutations: {
      // Smart retry logic - don't retry client errors
      retry: shouldRetry,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),

      // Network mode: online-only for mutations
      networkMode: 'online',

      // Global mutation error handler
      onError: (error) => {
        if (error instanceof ApiError) {
          console.error(
            `Mutation Error ❌:`,
            JSON.stringify(
              {
                message: error.message,
                code: error.code,
                status: error.status,
                timestamp: error.timestamp,
              },
              null,
              2,
            ),
          );

          // Show user-friendly error alert
          Alert.alert('Error', error.message, [
            { text: 'OK', style: 'default' },
          ]);
        } else {
          console.error('[Mutation Error - Unknown]', error);
          Alert.alert('Error', 'An unexpected error occurred', [
            { text: 'OK', style: 'default' },
          ]);
        }
      },

      // Global mutation success handler (optional, can be overridden)
      onSuccess: (data: unknown) => {
        console.log(
          `Mutation Success ✅:`,
          JSON.stringify(
            {
              hasData: !!data,
            },
            null,
            2,
          ),
        );
      },
    },
  },
});
