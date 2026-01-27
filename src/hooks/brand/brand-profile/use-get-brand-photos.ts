import { useQuery } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';
import { IBrandPhoto } from '@/types/brand.type';

const getBrandPhotos = async (brandId: string): Promise<IBrandPhoto[]> =>
  await agent.get(`/brand/${brandId}/photos`);

export const useGetBrandPhotos = ({ brandId }: { brandId?: string }) =>
  useQuery({
    queryKey: [...queryKeys.creator.photos, { brandId }],
    queryFn: () => getBrandPhotos(brandId!),
    enabled: !!brandId,
  });
