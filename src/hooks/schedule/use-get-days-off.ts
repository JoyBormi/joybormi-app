import { useQuery } from '@tanstack/react-query';

import { agent, ApiError } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

import type { ISpecialDayOff } from '@/types/schedule.type';

const getDaysOff = async (scheduleId: string): Promise<ISpecialDayOff[]> => {
  try {
    return await agent.get(`/schedules/${scheduleId}/days-off`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return [];
    }
    throw error;
  }
};

export const useGetDaysOff = ({ scheduleId }: { scheduleId?: string }) =>
  useQuery({
    queryKey: [...queryKeys.schedule.detail, 'days-off', { scheduleId }],
    queryFn: () => getDaysOff(scheduleId!),
    enabled: !!scheduleId,
  });
