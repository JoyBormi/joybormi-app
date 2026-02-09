import { useMutation } from '@tanstack/react-query';

import { ApiResponse } from '@/lib/agent';
import { agent } from '@/lib/agent/client';

export interface SendEmailVerifyPayload {
  email: string;
}

interface SendEmailVerifyResponse {
  message?: string;
}

export async function sendEmailVerifyApi(
  payload: SendEmailVerifyPayload,
): Promise<SendEmailVerifyResponse> {
  const response = await agent.post<ApiResponse<SendEmailVerifyResponse>>(
    '/auth/email/send-verification',
    payload,
  );
  return response.data;
}

export function useSendEmailVerify() {
  return useMutation<SendEmailVerifyResponse, Error, SendEmailVerifyPayload>({
    mutationFn: sendEmailVerifyApi,
  });
}
