import { useMutation, useQueryClient } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

import type { IWorker } from '@/types/worker.type';

export interface UpdateWorkerPayload {
  firstName?: string;
  lastName?: string;
  image?: string;
  preferredLocation?: string;
  language?: string;
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
  payload: UpdateWorkerPayload,
): Promise<IWorker> => await agent.put(`/workers/me/profile`, payload);

export const useUpdateWorkerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateWorkerPayload) => updateWorkerProfile(payload),
    onSuccess: (data) => {
      queryClient.setQueryData([...queryKeys.worker.profile], data);
      queryClient.invalidateQueries({ queryKey: queryKeys.worker.profile });
    },
  });
};
