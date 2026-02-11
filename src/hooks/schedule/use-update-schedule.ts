import { useMutation, useQueryClient } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

import type { ISchedule, UpdateSchedulePayload } from '@/types/schedule.type';

type ScheduleParams =
  | string
  | {
      brandId?: string;
      workerId?: string;
      scheduleId?: string;
    };

const normalizeScheduleParams = (params?: ScheduleParams) => {
  if (typeof params === 'string') {
    return { brandId: params, workerId: undefined, scheduleId: undefined };
  }
  return {
    brandId: params?.brandId,
    workerId: params?.workerId,
    scheduleId: params?.scheduleId,
  };
};

const getScheduleEndpoint = (brandId: string, workerId?: string) =>
  workerId
    ? `/schedules/${brandId}/worker/${workerId}`
    : `/schedules/${brandId}`;

const createSchedule = async (
  brandId: string,
  workerId: string | undefined,
  payload: UpdateSchedulePayload,
): Promise<ISchedule> =>
  await agent.post(getScheduleEndpoint(brandId, workerId), payload);

const updateSchedule = async (
  brandId: string,
  workerId: string | undefined,
  payload: UpdateSchedulePayload,
): Promise<ISchedule> =>
  await agent.put(getScheduleEndpoint(brandId, workerId), payload);

export const useUpdateSchedule = (params?: ScheduleParams) => {
  const queryClient = useQueryClient();
  const { brandId, workerId, scheduleId } = normalizeScheduleParams(params);

  return useMutation({
    mutationFn: (payload: UpdateSchedulePayload) => {
      if (!brandId) {
        throw new Error('Brand ID is required');
      }
      if (scheduleId) {
        return updateSchedule(brandId, workerId, payload);
      }

      return createSchedule(brandId, workerId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedule.all,
      });
    },
  });
};
