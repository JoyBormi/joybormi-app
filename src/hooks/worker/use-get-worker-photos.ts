import { useQuery } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';
import { IFile } from '@/types/file.type';

export const useGetWorkerPhotos = (id?: string) =>
  useQuery({
    queryKey: [...queryKeys.worker.profile, 'photos', { id }],
    queryFn: async (): Promise<IFile[]> =>
      await agent.get<IFile[]>(`/workers/${id}/photos`),
    enabled: !!id,
  });
