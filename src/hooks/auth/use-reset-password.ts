import { ApiResponse } from '@/lib/agent';
import { agent } from '@/lib/agent/client';
import { useMutation } from '@tanstack/react-query';

/**
 * Reset password payload
 */
export interface ResetPasswordPayload {
  resetToken: string; // Token from verify code step
  password: string;
  confirmPassword: string;
}

/**
 * Reset password response
 */
interface ResetPasswordResponse {
  message: string;
}

/**
 * Reset password API call
 * Resets the password using the reset token
 */
export async function resetPasswordApi(
  payload: ResetPasswordPayload,
): Promise<ResetPasswordResponse> {
  const response = await agent.post<ApiResponse<ResetPasswordResponse>>(
    '/auth/reset-password',
    payload,
  );
  // Unwrap ApiResponse to get { message }
  return response.data;
}

/**
 * Reset password mutation hook
 * Resets the user's password
 *
 * @example
 * const { mutate: resetPassword, isPending } = useResetPassword();
 * resetPassword({
 *   resetToken: 'token-from-verify-step',
 *   password: 'newPassword123',
 *   confirmPassword: 'newPassword123'
 * });
 */
export function useResetPassword() {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordPayload>({
    mutationFn: resetPasswordApi,

    onSuccess: (response) => {
      const data = response;
      console.warn('[Reset Password Success]', {
        message: data.message,
      });
    },

    onError: (error) => {
      console.error('[Reset Password Error]', error);
    },
  });
}
