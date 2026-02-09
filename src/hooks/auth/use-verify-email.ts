import { useMutation } from '@tanstack/react-query';

import { ApiResponse } from '@/lib/agent';
import { agent } from '@/lib/agent/client';

export interface VerifyEmailPayload {
  token: string;
}

interface VerifyEmailResponse {
  message?: string;
}

export async function verifyEmailApi(
  payload: VerifyEmailPayload,
): Promise<VerifyEmailResponse> {
  const response = await agent.post<ApiResponse<VerifyEmailResponse>>(
    '/auth/email/verify-email',
    payload,
  );
  return response.data;
}

export function useVerifyEmail() {
  return useMutation<VerifyEmailResponse, Error, VerifyEmailPayload>({
    mutationFn: verifyEmailApi,
  });
}
