import { useMutation, useQueryClient } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

import type { CreateServicePayload, IService } from '@/types/service.type';

const createService = async (
  brandId: string,
  payload: CreateServicePayload,
): Promise<IService> => await agent.post(`/services`, { ...payload, brandId });

export const useCreateService = (brandId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateServicePayload) =>
      createService(brandId, payload),
    onSuccess: () => {
      // Invalidate services list
      queryClient.invalidateQueries({
        queryKey: queryKeys.service.list,
      });
    },
  });
};
