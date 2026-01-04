import { useQuery } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

import type { IService } from '@/types/service.type';

const getServiceDetail = async (id?: string): Promise<IService> => {
  return await agent.get(`/services/${id}`);
};

export const useGetServiceDetail = (id?: string) =>
  useQuery({
    queryKey: [...queryKeys.service.detail, { id }],
    queryFn: () => getServiceDetail(id),
    enabled: !!id,
  });
