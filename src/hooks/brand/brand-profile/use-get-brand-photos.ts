import { useQuery } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';
import { IFile } from '@/types/file.type';

const getBrandPhotos = async (id?: string): Promise<IFile[]> =>
  await agent.get(`/brand/${id}/photos`);

export const useGetBrandPhotos = (id?: string) =>
  useQuery({
    queryKey: [...queryKeys.creator.photos, { id }],
    queryFn: () => getBrandPhotos(id),
    enabled: !!id,
  });
