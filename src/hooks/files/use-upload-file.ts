import { useMutation } from '@tanstack/react-query';

import { uploadFile } from '@/hooks/files/file.service';

import type { FileUploadPayload, IFile } from '@/types/file.type';

export const useUploadFile = () =>
  useMutation<IFile, Error, FileUploadPayload>({
    mutationFn: (payload) => uploadFile(payload),
  });
