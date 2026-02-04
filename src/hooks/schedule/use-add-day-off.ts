import { useMutation, useQueryClient } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

import type {
  CreateSpecialDayOffPayload,
  ISpecialDayOff,
} from '@/types/schedule.type';

const addDayOff = async (
  brandId: string,
  payload: CreateSpecialDayOffPayload,
): Promise<ISpecialDayOff> =>
  await agent.post(`/brands/${brandId}/schedule/closures`, payload);

export const useAddDayOff = (brandId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSpecialDayOffPayload) => {
      if (!brandId) {
        throw new Error('Brand ID is required');
      }
      return addDayOff(brandId, payload);
    },
    onSuccess: () => {
      // Invalidate schedule queries to refetch days off
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedule.detail,
      });
    },
  });
};
