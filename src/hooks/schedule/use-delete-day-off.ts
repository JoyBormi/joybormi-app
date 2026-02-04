import { useMutation, useQueryClient } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

const deleteDayOff = async (
  brandId: string,
  closureId: string,
): Promise<void> =>
  await agent.delete(`/brands/${brandId}/schedule/closures/${closureId}`);

export const useDeleteDayOff = (brandId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (closureId: string) => {
      if (!brandId) {
        throw new Error('Brand ID is required');
      }
      return deleteDayOff(brandId, closureId);
    },
    onSuccess: () => {
      // Invalidate schedule queries to refetch days off
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedule.detail,
      });
    },
  });
};
