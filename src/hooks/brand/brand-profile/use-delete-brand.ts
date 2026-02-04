import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

import { routes } from '@/constants/routes';
import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';
import { useUserStore } from '@/stores';
import { EUserType } from '@/types/user.type';

export const useDeleteBrand = () => {
  const { setAppType } = useUserStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => agent.delete(`/brand/me`),
    onSuccess: () => {
      router.replace(routes.root);

      setAppType(EUserType.USER);

      // Clear all brand-related queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.creator.brand,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.creator.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.worker.all,
      });
    },
  });
};
