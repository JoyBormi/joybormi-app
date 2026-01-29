import { useMutation } from '@tanstack/react-query';

import { getFileUrl, uploadFile, uploadMultipleFiles } from '@/services/files';

import type { UploadedFile } from '@/utils/file-upload';

interface UploadResponse {
  url: string;
}

interface UploadMultipleResponse {
  urls: string[];
}

/**
 * Upload a single file to the server (legacy wrapper)
 */
const uploadSingleFile = async (
  file: UploadedFile,
): Promise<UploadResponse> => {
  const uploadedFile = await uploadFile({ file });
  const url = getFileUrl(uploadedFile);

  if (!url) {
    throw new Error('File upload did not return a URL');
  }

  return { url };
};

/**
 * Upload multiple files to the server (legacy wrapper)
 */
const uploadMultipleFilesLegacy = async (
  files: UploadedFile[],
): Promise<UploadMultipleResponse> => {
  const uploadedFiles = await uploadMultipleFiles({ files });
  const urls = uploadedFiles
    .map((file) => getFileUrl(file))
    .filter((url): url is string => Boolean(url));

  return { urls };
};

/**
 * Hook for uploading a single file
 */
export const useUploadFile = () => {
  return useMutation({
    mutationFn: ({
      file,
      fieldName: _fieldName,
    }: {
      file: UploadedFile;
      fieldName?: string;
    }) => uploadSingleFile(file),
  });
};

/**
 * Hook for uploading multiple files
 */
export const useUploadMultipleFiles = () => {
  return useMutation({
    mutationFn: ({
      files,
      fieldName: _fieldName,
    }: {
      files: UploadedFile[];
      fieldName?: string;
    }) => uploadMultipleFilesLegacy(files),
  });
};
