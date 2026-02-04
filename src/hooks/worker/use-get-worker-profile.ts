import { useQuery } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';
import { IWorker } from '@/types/worker.type';

export const useGetWorkerProfile = () =>
  useQuery({
    queryKey: [...queryKeys.worker.profile],
    queryFn: async (): Promise<IWorker> => await agent.get(`/workers/me`),
  });
