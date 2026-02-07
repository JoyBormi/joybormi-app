import { useQuery } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

import type { IExperience } from '@/types/experience.type';

const getExperiences = async (): Promise<IExperience[]> =>
  await agent.get(`/experiences/me`);

export const useGetExperiences = () =>
  useQuery({
    queryKey: [...queryKeys.worker.experiences],
    queryFn: () => getExperiences(),
  });
