import { agent } from '@/lib/agent/client';
import { queryKeys } from '@/lib/tanstack-query/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthResponse, LoginCredentials } from './types';

export async function loginApi(
  credentials: LoginCredentials,
): Promise<AuthResponse> {
  const response = await agent.post<AuthResponse>('/auth/login', credentials);
  return response.data;
}

/**
 * Login mutation hook
 * Handles user authentication and cache updates
 *
 * @example
 * const { mutate, isPending, error } = useLogin();
 * mutate({ email: 'user@example.com', password: 'password' });
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: loginApi,

    onSuccess: (data) => {
      // Store auth token (you should use secure storage like expo-secure-store)
      // SecureStore.setItemAsync('auth_token', data.token);

      // Update auth cache with user data
      // Query key pattern: [...queryKeys.auth.me, { role: data.user.role }]
      queryClient.setQueryData(
        [...queryKeys.auth.me, { role: data.user.role }],
        data.user,
      );

      // Invalidate all queries to refetch with new auth context
      queryClient.invalidateQueries();

      console.warn('[Login Success]', data.user);
    },

    onError: (error) => {
      console.error('[Login Error]', error.message);
      // Global error handler will show alert
    },
  });
}
