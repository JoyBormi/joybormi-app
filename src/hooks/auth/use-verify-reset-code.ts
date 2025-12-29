import { ApiResponse } from '@/lib/agent';
import { agent } from '@/lib/agent/client';
import { useMutation } from '@tanstack/react-query';

/**
 * Verify reset code payload
 */
export interface VerifyResetCodePayload {
  method: 'email' | 'phone';
  identifier: string; // email or phone
  code: string; // 6-digit code
}

/**
 * Verify reset code response
 */
interface VerifyResetCodeResponse {
  message: string;
  resetToken: string; // Token to use for password reset
}

/**
 * Verify reset code API call
 * Verifies the code sent to email/phone
 */
export async function verifyResetCodeApi(
  payload: VerifyResetCodePayload,
): Promise<VerifyResetCodeResponse> {
  const response = await agent.post<ApiResponse<VerifyResetCodeResponse>>(
    '/auth/verify-reset-code',
    payload,
  );
  // Unwrap ApiResponse to get { message, resetToken }
  return response.data;
}

/**
 * Verify reset code mutation hook
 * Verifies the code and returns a reset token
 *
 * @example
 * const { mutate: verifyCode, isPending } = useVerifyResetCode();
 * verifyCode({
 *   method: 'email',
 *   identifier: 'user@example.com',
 *   code: '123456'
 * });
 */
export function useVerifyResetCode() {
  return useMutation<VerifyResetCodeResponse, Error, VerifyResetCodePayload>({
    mutationFn: verifyResetCodeApi,

    onSuccess: (response) => {
      const data = response;
      console.warn('[Verify Reset Code Success]', {
        message: data.message,
      });
    },
  });
}
