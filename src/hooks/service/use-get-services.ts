import { useQuery } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

import type { IService, ServiceOwnerType } from '@/types/service.type';

type ServicesQuery = {
  ownerId?: string;
  ownerType?: ServiceOwnerType;
};

export const useGetServices = ({ ownerId, ownerType }: ServicesQuery = {}) =>
  useQuery({
    queryKey: [...queryKeys.service.list, { ownerId, ownerType }],
    queryFn: async (): Promise<IService[]> => {
      const query = [
        ownerId ? `ownerId=${ownerId}` : '',
        ownerType ? `ownerType=${ownerType}` : '',
      ]
        .filter(Boolean)
        .join('&');
      return await agent.get(`/services${query ? `?${query}` : ''}`);
    },
    enabled: !!ownerId || !!ownerType,
  });
