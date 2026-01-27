import { useQuery } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';
import { IWorker } from '@/types/worker.type';

const getWorkerProfile = async (userId: string): Promise<IWorker> =>
  await agent.get(`/worker/${userId}`);

export const useGetWorkerProfile = ({ userId }: { userId?: string }) =>
  useQuery({
    queryKey: [...queryKeys.worker.profile, { userId }],
    queryFn: () => getWorkerProfile(userId!),
    enabled: !!userId,
  });
