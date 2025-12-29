import { ApiResponse } from '@/lib/agent';
import { agent } from '@/lib/agent/client';
import { useMutation } from '@tanstack/react-query';

/**
 * Forgot password request payload
 */
export interface ForgotPasswordPayload {
  method: 'email' | 'phone';
  identifier: string; // email or phone
}

/**
 * Forgot password response
 */
interface ForgotPasswordResponse {
  message: string;
  expiresAt: string;
}

/**
 * Forgot password API call
 * Sends verification code to email or phone
 */
export async function forgotPasswordApi(
  payload: ForgotPasswordPayload,
): Promise<ForgotPasswordResponse> {
  const response = await agent.post<ApiResponse<ForgotPasswordResponse>>(
    '/auth/forgot-password',
    payload,
  );
  // Unwrap ApiResponse to get { message, expiresAt }
  return response.data;
}

/**
 * Forgot password mutation hook
 * Sends verification code for password reset
 *
 * @example
 * const { mutate: sendCode, isPending } = useForgotPassword();
 * sendCode({
 *   method: 'email',
 *   identifier: 'user@example.com'
 * });
 */
export function useForgotPassword() {
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordPayload>({
    mutationFn: forgotPasswordApi,

    onSuccess: (response) => {
      const data = response;
      console.warn('[Forgot Password Success]', {
        message: data.message,
        expiresAt: data.expiresAt,
      });
    },

    onError: (error) => {
      console.error('[Forgot Password Error]', error);
    },
  });
}
