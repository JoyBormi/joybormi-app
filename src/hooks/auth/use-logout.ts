import { agent } from '@/lib/agent';
import { useMutation, useQueryClient } from '@tanstack/react-query';
/**
 * Logout API call
 */
export async function logoutApi(token: string): Promise<void> {
  await agent.post<void>('/auth/logout', { token });
}

/**
 * Logout mutation hook
 * Handles user logout and cache cleanup
 *
 * @example
 * const { mutate, isPending } = useLogout();
 * mutate(authToken);
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: logoutApi,

    onSuccess: () => {
      // Clear auth token from secure storage
      // SecureStore.deleteItemAsync('auth_token');

      // Clear all cached data
      queryClient.clear();

      console.log('[Logout Success]');
    },

    onError: (error) => {
      console.error('[Logout Error]', error.message);
      // Even if API call fails, clear local cache
      queryClient.clear();
    },
  });
}
