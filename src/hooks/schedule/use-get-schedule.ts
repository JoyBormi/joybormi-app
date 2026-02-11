import { useQuery } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

import type { ISchedule } from '@/types/schedule.type';

type ScheduleParams =
  | string
  | {
      brandId?: string;
      workerId?: string;
    };

const normalizeScheduleParams = (params?: ScheduleParams) => {
  if (typeof params === 'string') {
    return { brandId: params, workerId: undefined };
  }
  return {
    brandId: params?.brandId,
    workerId: params?.workerId,
  };
};

const getSchedule = async ({
  brandId,
  workerId,
}: {
  brandId: string;
  workerId?: string;
}): Promise<ISchedule | null> => {
  const endpoint = workerId
    ? `/schedules/${brandId}/worker/${workerId}`
    : `/schedules/${brandId}`;

  return await agent.get<ISchedule>(endpoint);
};

export const useGetSchedule = (params?: ScheduleParams) => {
  const { brandId, workerId } = normalizeScheduleParams(params);

  return useQuery({
    queryKey: [...queryKeys.schedule.detail, { brandId, workerId }],
    queryFn: () =>
      getSchedule({
        brandId: brandId!,
        workerId,
      }),
    enabled: !!brandId,
  });
};
