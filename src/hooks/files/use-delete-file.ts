import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/tanstack-query';
import { deleteFile } from '@/services/files';

export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteFile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.files.all });
    },
  });
};
