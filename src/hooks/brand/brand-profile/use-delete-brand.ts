import { useMutation, useQueryClient } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

const deleteBrand = async (brandId: string): Promise<void> =>
  await agent.delete(`/brand/${brandId}`);

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (brandId: string) => deleteBrand(brandId),
    onSuccess: () => {
      // Clear all brand-related queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.creator.brand,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.creator.all,
      });
    },
  });
};
