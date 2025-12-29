import { QueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { ApiError } from '../agent';

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

      // Retry failed requests 3 times with exponential backoff
      retry: 3,
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
      // Retry mutations once on failure
      retry: 1,
      retryDelay: 1000,

      // Network mode: online-only for mutations
      networkMode: 'online',

      // Global mutation error handler
      /**
       *
       * @param error  {"error": {"code": 90001, "message": "User already exists. Use another email.", "status": 400, "timestamp": "2025-12-29T03:42:53.629Z"}, "status": 400, "url": "/auth/signup"}
       */
      onError: (error) => {
        if (error instanceof ApiError) {
          console.error(`Mutation Error 👉:`, JSON.stringify(error, null, 2));

          // Show user-friendly error alert
          Alert.alert('Error', error.message, [
            { text: 'OK', style: 'default' },
          ]);
        }
      },

      // Global mutation success handler (optional, can be overridden)
      onSuccess: (data: any, variables: any, context: any) => {
        console.log(
          `Mutation Success 👉:`,
          JSON.stringify({ data, variables }, null, 2),
        );
      },
    },
  },
});
