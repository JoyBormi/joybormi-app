import { useMutation, useQueryClient } from '@tanstack/react-query';

import { agent } from '@/lib/agent/client';
import { queryKeys } from '@/lib/tanstack-query';
import { TCreateBrandInput } from '@/lib/validations/brand';
import { useUserStore } from '@/stores';
import { EUserType } from '@/types/user.type';

/**
 * Become creator API call
 */
export const becomeCreatorApi = async (
  payload: TCreateBrandInput,
): Promise<string> => await agent.post<string>('/user/become-creator', payload);

/**
 * Become creator mutation hook
 */
export function useBecomeCreator() {
  const queryClient = useQueryClient();
  const { setAppType } = useUserStore();

  return useMutation<string, Error, TCreateBrandInput>({
    mutationFn: becomeCreatorApi,

    onSuccess: (message) => {
      console.log(`🚀 ~ message:`, message);
      // Invalidate all queries to refetch with new user context
      queryClient.invalidateQueries({
        queryKey: queryKeys.auth.me,
      });
      setAppType(EUserType.CREATOR);
    },
  });
}
