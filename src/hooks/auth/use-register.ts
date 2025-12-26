import { agent } from '@/lib/agent/client';
import { queryKeys } from '@/lib/tanstack-query/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthResponse, RegisterCredentials } from './types';

/**
 * Register API call
 */
export async function registerApi(
  credentials: RegisterCredentials,
): Promise<AuthResponse> {
  const response = await agent.post<AuthResponse>(
    '/auth/register',
    credentials,
  );
  return response.data;
}

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

  return useMutation<AuthResponse, Error, RegisterCredentials>({
    mutationFn: registerApi,

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

      console.warn('[Register Success]', data.user);
    },

    onError: (error) => {
      console.error('[Register Error]', error.message);
      // Global error handler will show alert
    },
  });
}
