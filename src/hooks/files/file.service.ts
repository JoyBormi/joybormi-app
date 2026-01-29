import { agent, agentClass } from '@/lib/agent';

import type {
  FileUploadMultiplePayload,
  FileUploadPayload,
  IFile,
  UpdateFileMetadataPayload,
} from '@/types/file.type';
import type { UploadedFile } from '@/utils/file-upload';

type UploadFileApiResponse =
  | IFile
  | { file: IFile }
  | { data: IFile }
  | { url: string };

type UploadMultipleFilesApiResponse =
  | IFile[]
  | { files: IFile[] }
  | { data: IFile[] }
  | { urls: string[] };

const appendMetadata = (
  formData: FormData,
  metadata?: Record<string, string | number | boolean | undefined>,
) => {
  if (!metadata) return;
  Object.entries(metadata).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
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
  files.forEach((file) => {
    // @ts-expect-error - FormData accepts this format in React Native
    formData.append(fieldName, {
      uri: file.uri,
      name: file.name,
      type: file.type,
    });
  });
};

const normalizeFileResponse = (response: UploadFileApiResponse): IFile => {
  if ('file' in response) {
    return response.file;
  }
  if ('data' in response) {
    return response.data;
  }
  if ('url' in response) {
    return { url: response.url };
  }
  return response;
};

const normalizeFilesResponse = (
  response: UploadMultipleFilesApiResponse,
): IFile[] => {
  if (Array.isArray(response)) {
    return response;
  }
  if ('files' in response) {
    return response.files;
  }
  if ('data' in response) {
    return response.data;
  }
  if ('urls' in response) {
    return response.urls.map((url) => ({ url }));
  }
  return [];
};

export const getFileUrl = (file?: IFile | null): string | null =>
  file?.url ?? file?.path ?? null;

export const uploadFile = async ({
  file,
  description,
  category,
}: FileUploadPayload): Promise<IFile> => {
  const formData = new FormData();
  appendFile(formData, 'file', file);
  appendMetadata(formData, { description, category });

  const response = await agentClass.post<UploadFileApiResponse>(
    '/files/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return normalizeFileResponse(response.data);
};

export const uploadMultipleFiles = async ({
  files,
  category,
}: FileUploadMultiplePayload): Promise<IFile[]> => {
  const formData = new FormData();
  appendFiles(formData, 'files', files);
  appendMetadata(formData, { category });

  const response = await agentClass.post<UploadMultipleFilesApiResponse>(
    '/files/upload/multiple',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return normalizeFilesResponse(response.data);
};

export const getFileMetadata = async (id: string): Promise<IFile> =>
  await agent.get(`/files/${id}`);

export const getFilesByCategory = async (category: string): Promise<IFile[]> =>
  await agent.get(`/files/category/${category}`);

export const updateFileMetadata = async (
  id: string,
  payload: UpdateFileMetadataPayload,
): Promise<IFile> => await agent.patch(`/files/${id}/metadata`, payload);

export const replaceFile = async (
  id: string,
  file: UploadedFile,
): Promise<IFile> => {
  const formData = new FormData();
  appendFile(formData, 'file', file);

  const response = await agentClass.patch<UploadFileApiResponse>(
    `/files/${id}/replace`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return normalizeFileResponse(response.data);
};

export const deleteFile = async (id: string): Promise<void> => {
  await agent.delete(`/files/${id}`);
};
