import { useMutation, useQueryClient } from '@tanstack/react-query';

import { replaceFile } from '@/hooks/files/file.service';
import { queryKeys } from '@/lib/tanstack-query';

import type { IFile } from '@/types/file.type';
import type { UploadedFile } from '@/utils/file-upload';

export const useReplaceFile = () => {
  const queryClient = useQueryClient();

  return useMutation<IFile, Error, { id: string; file: UploadedFile }>({
    mutationFn: ({ id, file }) => replaceFile(id, file),
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
