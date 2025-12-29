import { agent } from '@/lib/agent/client';
import { storage } from '@/lib/mmkv';
import { queryKeys } from '@/lib/tanstack-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MeResponse } from './use-me';

/**
 * Refresh session API call
 * Extends the current session and returns a new token
 */
export async function refreshSessionApi(): Promise<MeResponse> {
  const response = await agent.post<MeResponse>('/auth/refresh');
  // Unwrap ApiResponse to get { token, expiresAt }
  return response;
}

/**
 * Refresh session mutation hook
 * Refreshes the current session and updates the stored token
 *
 * @example
 * const { mutate: refreshSession, isPending } = useRefreshSession();
 * refreshSession();
 */
export function useRefreshSession() {
  const queryClient = useQueryClient();

  return useMutation<MeResponse, Error, void>({
    mutationFn: refreshSessionApi,

    onSuccess: (data) => {
      // Update stored token
      storage.setItem('auth_token', data.session.token);

      // Invalidate /auth/me query to refetch with new token
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}
