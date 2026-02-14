import { useInfiniteQuery } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

type SearchServicesResponse = {
  services: {
    data: SearchService[];
    nextCursor: string | null;
  };
};

export type SearchService = {
  id?: string;
  serviceId: string;
  brandId: string;
  brandName: string;
  brandLocation?: string;
  businessCategory?: string;
  brandWorkingFields?: string[];
  brandProfileImage?: string | { url?: string; uri?: string; path?: string } | null;
  brandImages?: Array<string | { url?: string; uri?: string; path?: string }>;
  serviceName: string;
  durationMins: number;
  currency: string;
  price: number;
  workerName?: string;
  workerProfilePic?: string | { url?: string; uri?: string; path?: string } | null;
};

type SearchServicesQuery = {
  q?: string;
  category?: string;
  location?: string;
  brandId?: string;
  enabled?: boolean;
};

export const useSearchServices = ({
  q,
  category,
  location,
  brandId,
  enabled,
}: SearchServicesQuery) => {
  const normalizedQ = q?.trim();
  const normalizedCategory = category?.trim();
  const normalizedLocation = location?.trim();

  return useInfiniteQuery({
    queryKey: [
      ...queryKeys.search.services,
      {
        q: normalizedQ,
        category: normalizedCategory,
        location: normalizedLocation,
        brandId,
      },
    ],
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }): Promise<SearchServicesResponse> => {
      const params = new URLSearchParams();

      if (normalizedQ) {
        params.set('q', normalizedQ);
      }

      if (brandId) {
        params.set('brandId', brandId);
      }
      if (normalizedCategory) {
        params.set('category', normalizedCategory);
      }
      if (normalizedLocation) {
        params.set('location', normalizedLocation);
      }

      if (pageParam) {
        params.set('cursor', pageParam);
      }

      const query = params.toString();
      return await agent.get(`/search/services${query ? `?${query}` : ''}`);
    },
    getNextPageParam: (lastPage) => {
      return lastPage.services.nextCursor ?? undefined;
    },
    enabled: enabled ?? true,
  });
};
