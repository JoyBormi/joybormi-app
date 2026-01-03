import { useMutation, useQueryClient } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

import type { IService, UpdateServicePayload } from '@/types/service.type';

const updateService = async (
  serviceId: string,
  payload: UpdateServicePayload,
): Promise<IService> => await agent.put(`/services/${serviceId}`, payload);

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      serviceId,
      payload,
    }: {
      serviceId: string;
      payload: UpdateServicePayload;
    }) => updateService(serviceId, payload),
    onSuccess: () => {
      // Invalidate services list
      queryClient.invalidateQueries({
        queryKey: queryKeys.service.list,
      });
    },
  });
};
