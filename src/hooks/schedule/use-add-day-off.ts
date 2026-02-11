import { useMutation, useQueryClient } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

import type {
  CreateSpecialDayOffPayload,
  ISpecialDayOff,
} from '@/types/schedule.type';

const addDayOff = async (
  scheduleId: string,
  payload: CreateSpecialDayOffPayload,
): Promise<ISpecialDayOff> =>
  await agent.post(`/schedules/${scheduleId}/days-off`, payload);

export const useAddDayOff = (scheduleId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSpecialDayOffPayload) => {
      if (!scheduleId) {
        throw new Error('Schedule ID is required');
      }
      return addDayOff(scheduleId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedule.all,
      });
    },
  });
};
