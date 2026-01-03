import { useMutation, useQueryClient } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

const deleteService = async (serviceId: string): Promise<void> =>
  await agent.delete(`/services/${serviceId}`);

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceId: string) => deleteService(serviceId),
    onSuccess: () => {
      // Invalidate services list
      queryClient.invalidateQueries({
        queryKey: queryKeys.service.list,
      });
    },
  });
};
