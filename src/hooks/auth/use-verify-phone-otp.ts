import { useMutation } from '@tanstack/react-query';

import { ApiResponse } from '@/lib/agent';
import { agent } from '@/lib/agent/client';

export interface VerifyPhoneOtpPayload {
  phoneNumber: string;
  code: string;
  disableSession?: boolean;
  updatePhoneNumber?: boolean;
}

interface VerifyPhoneOtpResponse {
  message?: string;
}

export async function verifyPhoneOtpApi(
  payload: VerifyPhoneOtpPayload,
): Promise<VerifyPhoneOtpResponse> {
  const response = await agent.post<ApiResponse<VerifyPhoneOtpResponse>>(
    '/auth/phone/verify-otp',
    payload,
  );
  return response.data;
}

export function useVerifyPhoneOtp() {
  return useMutation<VerifyPhoneOtpResponse, Error, VerifyPhoneOtpPayload>({
    mutationFn: verifyPhoneOtpApi,
  });
}
