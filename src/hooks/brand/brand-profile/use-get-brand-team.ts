import { useQuery } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';
import { IWorker } from '@/types/worker.type';

const getBrandTeam = async (brandId: string): Promise<IWorker[]> =>
  await agent.get(`/brand/${brandId}/workers`);

export const useGetBrandTeam = (brandId?: string) =>
  useQuery({
    queryKey: [...queryKeys.creator.team, { brandId }],
    queryFn: () => getBrandTeam(brandId!),
    enabled: !!brandId,
  });
