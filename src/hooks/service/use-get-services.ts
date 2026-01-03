import { useQuery } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

import type { IService } from '@/types/service.type';

interface GetServicesParams {
  brandId?: string;
  ownerId?: string;
  ownerType?: 'BRAND' | 'WORKER';
}

const getServices = async (params: GetServicesParams): Promise<IService[]> => {
  const queryParams = new URLSearchParams();
  if (params.brandId) queryParams.append('brandId', params.brandId);
  if (params.ownerId) queryParams.append('ownerId', params.ownerId);
  if (params.ownerType) queryParams.append('ownerType', params.ownerType);

  return await agent.get(`/services?${queryParams.toString()}`);
};

export const useGetServices = (params: GetServicesParams) =>
  useQuery({
    queryKey: [...queryKeys.service.list, params],
    queryFn: () => getServices(params),
    enabled: !!(params.brandId || params.ownerId),
    refetchOnWindowFocus: true,
  });
