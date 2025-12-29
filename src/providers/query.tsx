import { useError } from '@/hooks/common/use-error';
import { ApiError } from '@/lib/agent';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRef } from 'react';

/**
 * Determines if an error should be retried
 * Don't retry:
 * - Network errors (status 0) - connection failures
 * - Client errors (4xx) except 408 (Request Timeout) and 429 (Too Many Requests)
 */
const shouldRetry = (failureCount: number, error: unknown): boolean => {
  if (error instanceof ApiError) {
    // Don't retry network errors (status 0) - these are connection failures
    // User needs to fix their network connection first
    if (error.status === 0) {
      return false;
    }

    // Don't retry client errors (4xx) except specific cases
    if (error.status >= 400 && error.status < 500) {
      // Retry these specific client errors
      if (error.status === 408 || error.status === 429) {
        return failureCount < 3;
      }
      // Don't retry other client errors (400, 401, 403, 404, etc.)
      return false;
    }

    // Retry server errors (5xx)
    return failureCount < 3;
  }
  // Don't retry unknown errors
  return false;
};

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const { errorHandler } = useError();
  const queryClientRef = useRef<QueryClient | null>(null);

  if (!queryClientRef.current) {
    /**
     * Global QueryClient configuration with centralized error and success handling
     * All queries and mutations inherit these defaults
     */
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          // Stale time: 5 minutes - data is considered fresh for this duration
          staleTime: 5 * 60 * 1000,

          // Cache time: 10 minutes - unused data stays in cache
          gcTime: 10 * 60 * 1000,

          // Retry failed requests with smart retry logic
          retry: shouldRetry,
          retryDelay: (attemptIndex) =>
            Math.min(1000 * 2 ** attemptIndex, 30000),

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
          retryDelay: (attemptIndex) =>
            Math.min(1000 * 2 ** attemptIndex, 10000),

          // Network mode: online-only for mutations
          networkMode: 'online',

          // Global mutation error handler
          onError: (error) => errorHandler(error),

          // Global mutation success handler (optional, can be overridden)
          onSuccess: (data: unknown) => {
            if (__DEV__) {
              // eslint-disable-next-line no-console
              console.info(
                `Mutation Success ✅:`,
                JSON.stringify(
                  {
                    hasData: !!data,
                  },
                  null,
                  2,
                ),
              );
            }
          },
        },
      },
    });
    queryClientRef.current = queryClient;
  }
  return (
    <QueryClientProvider client={queryClientRef.current}>
      {children}
    </QueryClientProvider>
  );
};
