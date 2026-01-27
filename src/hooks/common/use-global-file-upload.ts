import { useCallback, useState } from 'react';

import { agentClass } from '@/lib/agent';

import type { UploadedFile } from '@/utils/file-upload';
import type { AxiosProgressEvent } from 'axios';

export interface UploadRequestOptions {
  endpoint: string;
  fieldName?: string;
  onProgress?: (progress: number) => void;
  metadata?: Record<string, string | number | boolean>;
}

const appendMetadata = (
  formData: FormData,
  metadata?: Record<string, string | number | boolean>,
) => {
  if (!metadata) return;
  Object.entries(metadata).forEach(([key, value]) => {
    formData.append(key, String(value));
  });
};

const appendFile = (
  formData: FormData,
  fieldName: string,
  file: UploadedFile,
) => {
  // @ts-expect-error - FormData accepts this format in React Native
  formData.append(fieldName, {
    uri: file.uri,
    name: file.name,
    type: file.type,
  });
};

const appendFiles = (
  formData: FormData,
  fieldName: string,
  files: UploadedFile[],
) => {
  files.forEach((file, index) => {
    // @ts-expect-error - FormData accepts this format in React Native
    formData.append(`${fieldName}[${index}]`, {
      uri: file.uri,
      name: file.name,
      type: file.type,
    });
  });
};

export const useGlobalFileUpload = <TResponse = { url: string }>() => {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleProgress = useCallback(
    (event: AxiosProgressEvent, onProgress?: (progress: number) => void) => {
      if (!event.total) return;
      const nextProgress = Math.round((event.loaded / event.total) * 100);
      setProgress(nextProgress);
      onProgress?.(nextProgress);
    },
    [],
  );

  const uploadFile = useCallback(
    async (
      file: UploadedFile,
      options: UploadRequestOptions,
    ): Promise<TResponse> => {
      const { endpoint, fieldName = 'file', onProgress, metadata } = options;
      const formData = new FormData();

      appendFile(formData, fieldName, file);
      appendMetadata(formData, metadata);

      setProgress(0);
      setIsUploading(true);
      setError(null);

      try {
        const response = await agentClass.post<TResponse>(endpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (event) => handleProgress(event, onProgress),
        });

        setProgress(100);
        return response.data;
      } catch (err) {
        const uploadError =
          err instanceof Error ? err : new Error('Upload failed');
        setError(uploadError);
        throw uploadError;
      } finally {
        setIsUploading(false);
      }
    },
    [handleProgress],
  );

  const uploadFiles = useCallback(
    async (
      files: UploadedFile[],
      options: UploadRequestOptions,
    ): Promise<TResponse> => {
      const { endpoint, fieldName = 'files', onProgress, metadata } = options;
      const formData = new FormData();

      appendFiles(formData, fieldName, files);
      appendMetadata(formData, metadata);

      setProgress(0);
      setIsUploading(true);
      setError(null);

      try {
        const response = await agentClass.post<TResponse>(endpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (event) => handleProgress(event, onProgress),
        });

        setProgress(100);
        return response.data;
      } catch (err) {
        const uploadError =
          err instanceof Error ? err : new Error('Upload failed');
        setError(uploadError);
        throw uploadError;
      } finally {
        setIsUploading(false);
      }
    },
    [handleProgress],
  );

  const reset = useCallback(() => {
    setProgress(0);
    setError(null);
  }, []);

  return {
    progress,
    isUploading,
    error,
    uploadFile,
    uploadFiles,
    reset,
  };
};
