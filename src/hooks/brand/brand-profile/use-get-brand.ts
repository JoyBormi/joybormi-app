import { useQuery } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';
import { IBrand } from '@/types/brand.type';

const getBrand = async (id?: string): Promise<IBrand> =>
  await agent.get(`/brand/${id}`);

export const useGetBrand = ({ userId }: { userId?: string }) =>
  useQuery({
    queryKey: [...queryKeys.creator.brand, { userId }],
    queryFn: () => getBrand(userId),
    enabled: !!userId,
    refetchOnWindowFocus: true,
  });
