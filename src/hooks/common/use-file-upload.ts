import { useMutation } from '@tanstack/react-query';

import { agent } from '@/lib/agent';

import type { UploadedFile } from '@/utils/file-upload';

interface UploadResponse {
  url: string;
}

interface UploadMultipleResponse {
  urls: string[];
}

/**
 * Upload a single file to the server
 */
const uploadSingleFile = async (
  file: UploadedFile,
  fieldName: string = 'file',
): Promise<UploadResponse> => {
  const formData = new FormData();

  // @ts-expect-error - FormData accepts this format in React Native
  formData.append(fieldName, {
    uri: file.uri,
    name: file.name,
    type: file.type,
  });

  return await agent.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Upload multiple files to the server
 */
const uploadMultipleFiles = async (
  files: UploadedFile[],
  fieldName: string = 'files',
): Promise<UploadMultipleResponse> => {
  const formData = new FormData();

  files.forEach((file, index) => {
    // @ts-expect-error - FormData accepts this format in React Native
    formData.append(`${fieldName}[${index}]`, {
      uri: file.uri,
      name: file.name,
      type: file.type,
    });
  });

  return await agent.post('/upload/multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Hook for uploading a single file
 */
export const useUploadFile = () => {
  return useMutation({
    mutationFn: ({
      file,
      fieldName,
    }: {
      file: UploadedFile;
      fieldName?: string;
    }) => uploadSingleFile(file, fieldName),
  });
};

/**
 * Hook for uploading multiple files
 */
export const useUploadMultipleFiles = () => {
  return useMutation({
    mutationFn: ({
      files,
      fieldName,
    }: {
      files: UploadedFile[];
      fieldName?: string;
    }) => uploadMultipleFiles(files, fieldName),
  });
};
