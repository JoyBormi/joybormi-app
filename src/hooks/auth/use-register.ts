import { useMutation, useQueryClient } from '@tanstack/react-query';

import { agent } from '@/lib/agent/client';
import { storage } from '@/lib/mmkv';
import { useUserStore } from '@/stores';

import { AuthResponse, RegisterCredentials } from './types';

/**
 * Register API call
 */
const registerApi = async (
  credentials: RegisterCredentials,
): Promise<AuthResponse> =>
  await agent.post<AuthResponse>('/auth/signup', credentials);

/**
 * Register mutation hook
 * Handles user registration and cache updates
 *
 * @example
 * const { mutate, isPending, error } = useRegister();
 * mutate({
 *   email: 'user@example.com',
 *   password: 'password',
 *   name: 'John Doe',
 *   role: 'user'
 * });
 */
export function useRegister() {
  const queryClient = useQueryClient();
  const { setAppType, setIsLoggedIn, setUser } = useUserStore();

  return useMutation<AuthResponse, Error, RegisterCredentials>({
    mutationFn: registerApi,

    onSuccess: (response) => {
      // Store auth token in MMKV storage
      storage.setItem('auth_token', response.token);

      // Update user store
      setUser(response.user);
      setAppType(response.user.role);
      setIsLoggedIn(true);

      // Invalidate all queries to refetch with new auth context
      queryClient.invalidateQueries();
    },
  });
}
