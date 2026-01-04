import { useMutation, useQueryClient } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

import type { ISchedule, UpdateSchedulePayload } from '@/types/schedule.type';

const updateSchedule = async (
  scheduleId: string,
  payload: UpdateSchedulePayload,
): Promise<ISchedule> =>
  await agent.put(`/schedule/${scheduleId}/working-days`, payload);

export const useUpdateSchedule = (scheduleId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSchedulePayload) => {
      if (!scheduleId) {
        throw new Error('Schedule ID is required');
      }
      return updateSchedule(scheduleId, payload);
    },
    onSuccess: () => {
      // Invalidate schedule queries to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedule.detail,
      });
    },
  });
};
