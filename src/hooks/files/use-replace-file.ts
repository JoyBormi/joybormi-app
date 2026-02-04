import { useMutation, useQueryClient } from '@tanstack/react-query';

import { replaceFile } from '@/hooks/files/file.service';
import { queryKeys } from '@/lib/tanstack-query';

import type { FileOwnerType, IFile } from '@/types/file.type';
import type { UploadedFile } from '@/utils/file-upload';

export const useReplaceFile = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IFile,
    Error,
    {
      id: string;
      file: UploadedFile;
      ownerId: string;
      ownerType: FileOwnerType;
      category?: string;
    }
  >({
    mutationFn: ({ id, file, ownerId, ownerType, category }) =>
      replaceFile({ id, file, ownerId, ownerType, category }),
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
