import { ApiResponse } from '@/lib/agent';
import { agent } from '@/lib/agent/client';
import { storage } from '@/lib/mmkv';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLogout } from './use-logout';

/**
 * Session refresh response
 */
interface RefreshSessionResponse {
  token: string;
  expiresAt: string;
}

/**
 * Refresh session API call
 * Extends the current session and returns a new token
 */
export async function refreshSessionApi(): Promise<RefreshSessionResponse> {
  const response =
    await agent.post<ApiResponse<RefreshSessionResponse>>('/auth/refresh');
  // Unwrap ApiResponse to get { token, expiresAt }
  return response.data;
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
  const { mutate: logout } = useLogout();

  return useMutation<RefreshSessionResponse, Error, void>({
    mutationFn: refreshSessionApi,

    onSuccess: (data) => {
      console.warn('[Session Refresh Success]', {
        expiresAt: data.expiresAt,
      });

      // Update stored token
      storage.setItem('auth_token', data.token);

      // Invalidate /auth/me query to refetch with new token
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },

    onError: (error) => {
      console.error('[Session Refresh Error]', error);
      // If refresh fails, log out the user
      console.warn('[Session Refresh] Logging out user due to refresh failure');
      logout();
    },
  });
}
