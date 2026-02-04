import { useMutation, useQueryClient } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

import type { ISchedule, UpdateSchedulePayload } from '@/types/schedule.type';

const updateSchedule = async (
  brandId: string,
  payload: UpdateSchedulePayload,
): Promise<ISchedule> =>
  await agent.put(`/brands/${brandId}/schedule`, payload);

export const useUpdateSchedule = (brandId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSchedulePayload) => {
      if (!brandId) {
        throw new Error('Brand ID is required');
      }
      return updateSchedule(brandId, payload);
    },
    onSuccess: () => {
      // Invalidate schedule queries to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedule.detail,
      });
    },
  });
};
