import { useMutation, useQueryClient } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

import type { ISchedule, UpdateSchedulePayload } from '@/types/schedule.type';

const updateSchedule = async (
  brandId: string,
  payload: UpdateSchedulePayload,
): Promise<ISchedule> => await agent.put(`/schedule/${brandId}`, payload);

export const useUpdateSchedule = (brandId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSchedulePayload) =>
      updateSchedule(brandId, payload),
    onSuccess: (data) => {
      // Update the schedule query cache
      queryClient.setQueryData(
        [...queryKeys.schedule.detail, { brandId }],
        data,
      );

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedule.detail,
      });
    },
  });
};
