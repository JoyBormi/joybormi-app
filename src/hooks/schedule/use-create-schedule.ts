import { useMutation, useQueryClient } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

import type { ISchedule } from '@/types/schedule.type';

interface CreateSchedulePayload {
  brandId: string;
}

const createSchedule = async (
  payload: CreateSchedulePayload,
): Promise<ISchedule> => await agent.post('/schedule', payload);

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSchedulePayload) => createSchedule(payload),
    onSuccess: () => {
      // Invalidate schedule queries to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedule.all,
      });
    },
  });
};
