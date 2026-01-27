import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';
import { IBrand } from '@/types/brand.type';
import { EUserType } from '@/types/user.type';

export const useGetBrand = (
  userId?: string,
  appType?: EUserType,
): UseQueryResult<IBrand, Error> =>
  useQuery<IBrand, Error, IBrand, string[]>({
    queryKey: [...queryKeys.creator.brand, { userId, appType }] as string[],
    queryFn: () => agent.get(`/brand/me`),
    enabled: !!userId,
    refetchOnWindowFocus: true,
  });
