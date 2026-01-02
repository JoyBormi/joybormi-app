import { useMutation, useQueryClient } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

import type { IBrand } from '@/types/brand.type';

export interface UpdateBrandPayload {
  brandName?: string;
  businessName?: string;
  description?: string | null;
  country?: string;
  state?: string;
  city?: string;
  street?: string;
  detailedAddress?: string;
  postalCode?: string;
  email?: string | null;
  phone?: string;
  profileImage?: string | null;
  bannerImage?: string | null;
}

const updateBrand = async (
  brandId: string,
  payload: UpdateBrandPayload,
): Promise<IBrand> => await agent.put(`/brand/${brandId}`, payload);

export const useUpdateBrand = (brandId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateBrandPayload) => updateBrand(brandId, payload),
    onSuccess: (data) => {
      // Update the brand query cache
      queryClient.setQueryData(
        [...queryKeys.creator.brand, { userId: data.creatorId }],
        data,
      );

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.creator.brand,
      });
    },
  });
};
