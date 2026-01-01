import { useMutation, useQueryClient } from '@tanstack/react-query';

import { agent } from '@/lib/agent/client';
import { storage } from '@/lib/mmkv';
import { useUserStore } from '@/stores';
import { EUserType } from '@/types/user.type';

/**
 * Withdraw API call
 */
export async function withdrawApi(): Promise<void> {
  await agent.post<void>('/auth/withdraw');
}

/**
 * Withdraw mutation hook
 * Handles user withdraw and cache cleanup
 *
 * @example
 * const { mutate, isPending } = useWithdraw();
 * mutate();
 */
export function useWithdraw() {
  const queryClient = useQueryClient();
  const { setUser, setIsLoggedIn, setAppType } = useUserStore();

  return useMutation<void, Error, void>({
    mutationFn: withdrawApi,

    onSuccess: () => {
      // Clear auth token from MMKV storage
      storage.removeItem('auth_token');

      // Clear user store
      setUser(null);
      setIsLoggedIn(false);
      setAppType(EUserType.GUEST);

      // Clear all cached data
      queryClient.clear();
    },

    onError: (error) => {
      console.error('[Withdraw Error]', error);
      // Even if API call fails, clear local data
      storage.removeItem('auth_token');
      setUser(null);
      setIsLoggedIn(false);
      setAppType(EUserType.GUEST);
      queryClient.clear();
    },
  });
}
