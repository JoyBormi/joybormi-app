import { useMutation } from '@tanstack/react-query';

import { ApiResponse } from '@/lib/agent';
import { agent } from '@/lib/agent/client';

/**
 * Reset password payload
 */
export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  revokeOtherSessions: boolean;
}

/**
 * Reset password response
 */
interface ChangePasswordResponse {
  message: string;
}

/**
 * Reset password API call
 * Resets the password using the reset token
 */
export async function changePasswordApi(
  payload: ChangePasswordPayload,
): Promise<ChangePasswordResponse> {
  const response = await agent.post<ApiResponse<ChangePasswordResponse>>(
    '/auth/change-password',
    payload,
  );
  // Unwrap ApiResponse to get { message }
  return response.data;
}

/**
 * Change password mutation hook
 * Changes the user's password
 *
 * @example
 * const { mutate: changePassword, isPending } = useChangePassword();
 * changePassword({
 *   newPassword: 'newPassword123',
 *   currentPassword: 'currentPassword123',
 *   revokeOtherSessions: true
 * });
 */
export function useChangePassword() {
  return useMutation<ChangePasswordResponse, Error, ChangePasswordPayload>({
    mutationFn: changePasswordApi,
  });
}
