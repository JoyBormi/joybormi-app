import { useMutation } from '@tanstack/react-query';

import { ApiResponse } from '@/lib/agent';
import { agent } from '@/lib/agent/client';

export interface SendPhoneOtpPayload {
  phoneNumber: string;
}

interface SendPhoneOtpResponse {
  message?: string;
}

export async function sendPhoneOtpApi(
  payload: SendPhoneOtpPayload,
): Promise<SendPhoneOtpResponse> {
  const response = await agent.post<ApiResponse<SendPhoneOtpResponse>>(
    '/auth/phone/send-otp',
    payload,
  );
  return response.data;
}

export function useSendPhoneOtp() {
  return useMutation<SendPhoneOtpResponse, Error, SendPhoneOtpPayload>({
    mutationFn: sendPhoneOtpApi,
  });
}
