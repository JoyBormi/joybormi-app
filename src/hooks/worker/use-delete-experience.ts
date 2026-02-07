import { useMutation, useQueryClient } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

const deleteExperience = async (id: string): Promise<void> =>
  await agent.delete(`/experiences/${id}`);

export const useDeleteExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.worker.experiences,
      });
    },
  });
};
