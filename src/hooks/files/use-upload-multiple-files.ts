import { useMutation } from '@tanstack/react-query';

import { uploadMultipleFiles } from '@/services/files';

import type { FileUploadMultiplePayload, IFile } from '@/types/file.type';

export const useUploadMultipleFiles = () =>
  useMutation<IFile[], Error, FileUploadMultiplePayload>({
    mutationFn: (payload) => uploadMultipleFiles(payload),
  });
