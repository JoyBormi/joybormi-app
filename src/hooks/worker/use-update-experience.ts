import { useMutation, useQueryClient } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

import type {
  IExperience,
  UpdateExperiencePayload,
} from '@/types/experience.type';

const updateExperience = async (
  id: string,
  payload: UpdateExperiencePayload,
): Promise<IExperience> => await agent.put(`/experiences/${id}`, payload);

export const useUpdateExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateExperiencePayload;
    }) => updateExperience(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.worker.experiences,
      });
    },
  });
};
