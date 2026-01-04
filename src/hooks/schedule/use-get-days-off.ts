import { useQuery } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

import type { ISpecialDayOff } from '@/types/schedule.type';

const getDaysOff = async (scheduleId: string): Promise<ISpecialDayOff[]> =>
  await agent.get(`/schedule/${scheduleId}/days-off`);

export const useGetDaysOff = ({ scheduleId }: { scheduleId?: string }) =>
  useQuery({
    queryKey: [...queryKeys.schedule.detail, 'days-off', { scheduleId }],
    queryFn: () => getDaysOff(scheduleId!),
    enabled: !!scheduleId,
  });
