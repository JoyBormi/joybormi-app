import { useQuery } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

import type { ISpecialDayOff } from '@/types/schedule.type';

const getDaysOff = async (brandId: string): Promise<ISpecialDayOff[]> =>
  await agent.get(`/brands/${brandId}/schedule/closures`);

export const useGetDaysOff = ({ brandId }: { brandId?: string }) =>
  useQuery({
    queryKey: [...queryKeys.schedule.detail, 'days-off', { brandId }],
    queryFn: () => getDaysOff(brandId!),
    enabled: !!brandId,
  });
