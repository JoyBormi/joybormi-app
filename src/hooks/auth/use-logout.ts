import { agent } from '@/lib/agent/client';
import { storage } from '@/lib/mmkv';
import { useUserStore } from '@/stores';
import { EUserType } from '@/types/user.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Logout API call
 */
export async function logoutApi(): Promise<void> {
  const token = storage.getItem('auth_token');
  if (token) {
    await agent.post<void>(
      '/auth/logout',
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );
  }
}

/**
 * Logout mutation hook
 * Handles user logout and cache cleanup
 *
 * @example
 * const { mutate, isPending } = useLogout();
 * mutate();
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const { setUser, setIsLoggedIn, setAppType } = useUserStore();

  return useMutation<void, Error, void>({
    mutationFn: logoutApi,

    onSuccess: () => {
      // Clear auth token from MMKV storage
      storage.removeItem('auth_token');

      // Clear user store
      setUser(null);
      setIsLoggedIn(false);
      setAppType(EUserType.GUEST);

      // Clear all cached data
      queryClient.clear();

      console.warn('[Logout Success]');
    },

    onError: (error) => {
      console.error('[Logout Error]', error);
      // Even if API call fails, clear local data
      storage.removeItem('auth_token');
      setUser(null);
      setIsLoggedIn(false);
      setAppType(EUserType.GUEST);
      queryClient.clear();
    },
  });
}
