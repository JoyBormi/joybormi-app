import { useQuery } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

import type { ISchedule } from '@/types/schedule.type';

const getSchedule = async (brandId: string): Promise<ISchedule> =>
  await agent.get(`/schedule/me/${brandId}`);

export const useGetSchedule = ({ brandId }: { brandId?: string }) =>
  useQuery({
    queryKey: [...queryKeys.schedule.detail, { brandId }],
    queryFn: () => getSchedule(brandId!),
    enabled: !!brandId,
  });
