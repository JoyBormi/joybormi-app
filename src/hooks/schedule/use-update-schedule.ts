import { useMutation, useQueryClient } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

import type { ISchedule, UpdateSchedulePayload } from '@/types/schedule.type';

const getScheduleEndpoint = (brandId: string, workerId?: string) =>
  workerId
    ? `/schedules/${brandId}/worker/${workerId}`
    : `/schedules/${brandId}`;

/**
 * @description Use this hook to update a schedule
 * @param params The schedule params
 * @returns A mutation object
 */
export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      brandId,
      workerId,
      schedules,
    }: {
      brandId: string;
      workerId?: string;
      schedules: UpdateSchedulePayload;
    }): Promise<ISchedule> =>
      await agent.put(getScheduleEndpoint(brandId, workerId), schedules),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedule.all,
      });
    },
  });
};
