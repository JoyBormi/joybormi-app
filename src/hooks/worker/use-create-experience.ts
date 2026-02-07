import { useMutation, useQueryClient } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

import type {
  CreateExperiencePayload,
  IExperience,
} from '@/types/experience.type';

const createExperience = async (
  payload: CreateExperiencePayload,
): Promise<IExperience> => await agent.post(`/experiences/me`, payload);

export const useCreateExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateExperiencePayload) => createExperience(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.worker.experiences,
      });
    },
  });
};
