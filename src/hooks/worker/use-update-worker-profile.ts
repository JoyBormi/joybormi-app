import { useMutation, useQueryClient } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

import type { IWorker } from '@/types/worker.type';

export interface UpdateWorkerPayload {
  name?: string;
  role?: string;
  bio?: string;
  specialties?: string[];
  email?: string;
  phone?: string;
  avatar?: string;
  coverImage?: string;
}

const updateWorkerProfile = async (
  workerId: string,
  payload: UpdateWorkerPayload,
): Promise<IWorker> => await agent.put(`/worker/${workerId}`, payload);

export const useUpdateWorkerProfile = (workerId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateWorkerPayload) =>
      updateWorkerProfile(workerId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(
        [...queryKeys.worker.profile, { userId: data.userId }],
        data,
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.worker.profile });
    },
  });
};
