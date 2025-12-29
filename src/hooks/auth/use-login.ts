import { agent } from '@/lib/agent/client';
import { storage } from '@/lib/mmkv';
import { useUserStore } from '@/stores';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthResponse, LoginCredentials } from './types';

const loginApi = async (credentials: LoginCredentials): Promise<AuthResponse> =>
  await agent.post<AuthResponse>('/auth/login', credentials);

/**
 * Login mutation hook
 * Handles user authentication and cache updates
 *
 * @example
 * const { mutate, isPending, error } = useLogin();
 * mutate({ method: 'email', identifier: 'user@example.com', password: 'password' });
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const { setAppType, setIsLoggedIn, setUser, setLocation } = useUserStore();

  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: loginApi,

    onSuccess: (data) => {
      // Store auth token in MMKV storage
      storage.setItem('auth_token', data.token);

      // Update user store
      setUser(data.user);
      setAppType(data.user.role);
      setIsLoggedIn(true);

      // Store preferred location if available
      if (data.user.preferredLocation) {
        setLocation(data.user.preferredLocation);
      }

      // Invalidate all queries to refetch with new auth context
      queryClient.invalidateQueries();
    },
  });
}
