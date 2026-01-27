import { useQuery } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

import type { IReview } from '@/types/worker.type';

const getWorkerReviews = async (workerId: string): Promise<IReview[]> =>
  await agent.get(`/reviews/worker/${workerId}`);

export const useGetWorkerReviews = ({ workerId }: { workerId?: string }) =>
  useQuery({
    queryKey: [...queryKeys.worker.reviews, { workerId }],
    queryFn: () => getWorkerReviews(workerId!),
    enabled: !!workerId,
  });
