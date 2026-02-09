import { useMutation } from '@tanstack/react-query';

import { ApiResponse } from '@/lib/agent';
import { agent } from '@/lib/agent/client';

export interface ChangeEmailPayload {
  newEmail: string;
  callbackURL: string;
}

interface ChangeEmailResponse {
  message?: string;
}

export async function changeEmailApi(
  payload: ChangeEmailPayload,
): Promise<ChangeEmailResponse> {
  const response = await agent.post<ApiResponse<ChangeEmailResponse>>(
    '/auth/change-email',
    payload,
  );
  return response.data;
}

export function useChangeEmail() {
  return useMutation<ChangeEmailResponse, Error, ChangeEmailPayload>({
    mutationFn: changeEmailApi,
  });
}
