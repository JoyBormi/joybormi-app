import { ApiResponse } from '@/lib/agent';
import { agent } from '@/lib/agent/client';
import { storage } from '@/lib/mmkv';
import { queryKeys } from '@/lib/tanstack-query/query-keys';
import { IUser } from '@/types/user.type';
import { useQuery } from '@tanstack/react-query';

/**
 * Backend /auth/me response format
 */
interface MeResponse {
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
  const token = storage.getItem('auth_token');
  const response = await agent.get<ApiResponse<MeResponse>>('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // Unwrap ApiResponse to get { session, user }
  return response.data;
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
  });
}
