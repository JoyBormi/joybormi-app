import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/tanstack-query';
import { updateFileMetadata } from '@/services/files';

import type { IFile, UpdateFileMetadataPayload } from '@/types/file.type';

export const useUpdateFileMetadata = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IFile,
    Error,
    { id: string; payload: UpdateFileMetadataPayload }
  >({
    mutationFn: ({ id, payload }) => updateFileMetadata(id, payload),
    onSuccess: (data) => {
      if (data.id) {
        queryClient.invalidateQueries({
          queryKey: [...queryKeys.files.detail, { id: data.id }],
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.files.category });
    },
  });
};
