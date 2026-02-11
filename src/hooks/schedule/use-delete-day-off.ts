import { useMutation, useQueryClient } from '@tanstack/react-query';

import { agent } from '@/lib/agent';
import { queryKeys } from '@/lib/tanstack-query';

const deleteDayOff = async (dayOffId: string): Promise<void> =>
  await agent.delete(`/schedules/days-off/${dayOffId}`);

export const useDeleteDayOff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dayOffId: string) => deleteDayOff(dayOffId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedule.all,
      });
    },
  });
};
