import { useMutation } from '@tanstack/react-query';

import { uploadMultipleFiles } from '@/hooks/files/file.service';

import type { FileUploadMultiplePayload, IFile } from '@/types/file.type';

export const useUploadMultipleFiles = () =>
  useMutation<IFile[], Error, FileUploadMultiplePayload>({
    mutationFn: (payload) => uploadMultipleFiles(payload),
  });
