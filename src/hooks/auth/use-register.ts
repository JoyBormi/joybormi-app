import { ApiResponse } from '@/lib/agent';
import { agent } from '@/lib/agent/client';
import { storage } from '@/lib/mmkv';
import { useUserStore } from '@/stores';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthResponse, RegisterCredentials } from './types';

/**
 * Register API call
 */
const registerApi = async (
  credentials: RegisterCredentials,
): Promise<ApiResponse<AuthResponse>> =>
  await agent.post<ApiResponse<AuthResponse>>('/auth/signup', credentials);

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

  return useMutation<ApiResponse<AuthResponse>, Error, RegisterCredentials>({
    mutationFn: registerApi,

    onSuccess: (response) => {
      // Unwrap the data from ApiResponse
      const data = response.data;
      console.warn('[Register Success]', {
        userId: data.user.id,
        username: data.user.username,
      });

      // Store auth token in MMKV storage
      storage.setItem('auth_token', data.token);

      // Update user store
      setUser(data.user);
      setAppType(data.user.role);
      setIsLoggedIn(true);

      // Invalidate all queries to refetch with new auth context
      queryClient.invalidateQueries();
    },
  });
}
