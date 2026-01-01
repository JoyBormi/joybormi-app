import { useQuery } from '@tanstack/react-query';

import { agent } from '@/lib/agent/client';
import { queryKeys } from '@/lib/tanstack-query/query-keys';
import { IUser } from '@/types/user.type';

/**
 * Backend /auth/me response format
 */
export interface MeResponse {
  session: {
    id: string;
    userId: string;
    expiresAt: string;
    token: string;
  };
  user: IUser;
}

interface UseMeOptions {
  enabled?: boolean;
}

/**
 * Get current user API call
 * Backend returns { session, user }
 */
export async function getMeApi(): Promise<MeResponse> {
  const response = await agent.get<MeResponse>('/auth/me');
  return response;
}

/**
 * Get current user query hook
 * Fetches authenticated user data and session info
 *
 * @example
 * const { data, isLoading, error } = useMe({ enabled: true });
 * data = { session: {...}, user: {...} }
 */
export function useMe({ enabled = true }: UseMeOptions = {}) {
  return useQuery<MeResponse, Error>({
    queryKey: queryKeys.auth.me,
    queryFn: getMeApi,
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    // Refetch on window focus to check session validity
    refetchOnWindowFocus: true,
    // Don't retry on 401 errors (unauthorized)
    retry: (failureCount, error: Error) => {
      // Don't retry on 401 (unauthorized) or 403 (forbidden)
      const apiError = error as { status?: number };
      if (apiError?.status === 401 || apiError?.status === 403) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
  });
}
