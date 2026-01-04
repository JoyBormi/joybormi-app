import { useMutation, useQueryClient } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

const deleteDayOff = async (dayOffId: string): Promise<void> =>
  await agent.delete(`/schedule/days-off/${dayOffId}`);

export const useDeleteDayOff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dayOffId: string) => deleteDayOff(dayOffId),
    onSuccess: () => {
      // Invalidate schedule queries to refetch days off
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedule.detail,
      });
    },
  });
};
