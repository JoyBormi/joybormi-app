import { useInfiniteQuery } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

type SearchBrandsResponse = {
  brands: {
    data: SearchBrand[];
    nextCursor: string | null;
  };
};

export type SearchBrand = {
  id?: string;
  brandId: string;
  brandName: string;
  brandLocation?: string;
  businessCategory?: string;
  brandWorkingFields?: string[];
  brandProfileImage?: string | { url?: string; uri?: string; path?: string } | null;
  brandImages?: Array<string | { url?: string; uri?: string; path?: string }>;
};

type SearchBrandsQuery = {
  q?: string;
  category?: string;
  location?: string;
  enabled?: boolean;
};

export const useSearchBrands = ({
  q,
  category,
  location,
  enabled,
}: SearchBrandsQuery) => {
  const normalizedQ = q?.trim();
  const normalizedCategory = category?.trim();
  const normalizedLocation = location?.trim();

  return useInfiniteQuery({
    queryKey: [
      ...queryKeys.search.brands,
      {
        q: normalizedQ,
        category: normalizedCategory,
        location: normalizedLocation,
      },
    ],
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }): Promise<SearchBrandsResponse> => {
      const params = new URLSearchParams();

      if (normalizedQ) {
        params.set('q', normalizedQ);
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
      return await agent.get(`/search/brands${query ? `?${query}` : ''}`);
    },
    getNextPageParam: (lastPage) => {
      return lastPage.brands.nextCursor ?? undefined;
    },
    enabled: enabled ?? true,
  });
};
