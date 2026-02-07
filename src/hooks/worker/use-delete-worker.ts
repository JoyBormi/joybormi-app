import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

import { routes } from '@/constants/routes';
import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';
import { useUserStore } from '@/stores';
import { EUserType } from '@/types/user.type';

export const useDeleteWorker = () => {
  const { setAppType } = useUserStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => agent.delete(`/workers/me`),
    onSuccess: () => {
      router.replace(routes.root);

      setAppType(EUserType.USER);

      queryClient.invalidateQueries({
        queryKey: queryKeys.worker.all,
      });
    },
  });
};
