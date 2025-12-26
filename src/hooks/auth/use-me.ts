import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query/query-keys';
import { useQuery } from '@tanstack/react-query';
import { AuthResponse } from './types';

type UserRole = 'guest' | 'user' | 'worker' | 'creator';

interface UseMeOptions {
  role: UserRole;
  token: string | null;
  enabled?: boolean;
}

/**
 * Get current user API call
 */
export async function getMeApi(token: string): Promise<AuthResponse['user']> {
  const response = await agent.get<AuthResponse['user']>('/auth/me');
  return response.data;
}

/**
 * Get current user query hook
 * Fetches authenticated user data
 *
 * @example
 * const { data: user, isLoading, error } = useMe({
 *   role: 'user',
 *   token: authToken
 * });
 */
export function useMe({ role, token, enabled = true }: UseMeOptions) {
  return useQuery<AuthResponse['user'], Error>({
    // Query key pattern: [...queryKeys.auth.me, { role }]
    queryKey: [...queryKeys.auth.me, { role }],
    queryFn: () => {
      if (!token) throw new Error('No auth token');
      return getMeApi(token);
    },
    enabled: enabled && !!token,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}
