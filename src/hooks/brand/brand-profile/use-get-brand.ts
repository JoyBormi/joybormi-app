import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';
import { IBrand } from '@/types/brand.type';

export const useGetBrand = (): UseQueryResult<IBrand, Error> =>
  useQuery<IBrand, Error, IBrand, string[]>({
    queryKey: [...queryKeys.creator.brand] as string[],
    queryFn: () => agent.get(`/brand/me`),
    refetchOnWindowFocus: true,
  });
