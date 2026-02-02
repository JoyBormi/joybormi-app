import { appConfig } from '@/config/app.config';
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

const normalizeUri = (uri: string) => {
  if (uri.startsWith('file://')) return uri;
  if (uri.startsWith('/')) return `file://${uri}`;
  return uri;
};

const appendFile = (
  formData: FormData,
  fieldName: string,
  file: UploadedFile,
) => {
  const uri = normalizeUri(file.uri);

  // @ts-expect-error RN FormData
  formData.append(fieldName, {
    uri,
    name: file.name ?? `upload-${Date.now()}`,
    type: file.type ?? 'application/octet-stream',
  });
};

const appendFiles = (
  formData: FormData,
  fieldName: string,
  files: UploadedFile[],
) => {
  files.forEach((file) => {
    const uri = normalizeUri(file.uri);

    // @ts-expect-error RN FormData
    formData.append(fieldName, {
      uri,
      name: file.name ?? `upload-${Date.now()}`,
      type: file.type ?? 'application/octet-stream',
    });
  });
};

const normalizeFileResponse = (
  response: UploadFileApiResponse,
): UploadFileApiResponse => {
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
): UploadFileApiResponse[] => {
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

export const normalizeFileUrl = (url: string): string => {
  const r2Url = appConfig.api.r2BaseUrl;

  // If backend already returns an absolute URL (R2 public URL), keep it as-is.
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const base = r2Url.endsWith('/') ? r2Url.slice(0, -1) : r2Url;
  const path = url.startsWith('/') ? url : `/${url}`;

  return `${base}${path}`;
};

export const getFileUrl = (file: IFile): string | undefined => {
  const candidate = file.url;
  if (!candidate) return undefined;
  return normalizeFileUrl(candidate);
};

export const uploadFile = async ({
  file,
  description,
  category,
  userId,
}: FileUploadPayload): Promise<IFile> => {
  const formData = new FormData();

  // Append the actual file to FormData
  appendFile(formData, 'file', file);

  // Build query parameters for metadata
  const params = new URLSearchParams();

  if (userId) {
    params.append('userId', userId);
  }

  if (category) {
    params.append('category', category);
  }

  if (description) {
    params.append('description', description);
  }

  const response = await agentClass.post<UploadFileApiResponse>(
    `/files/upload?${params.toString()}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return normalizeFileResponse(response.data) as IFile;
};

export const uploadMultipleFiles = async ({
  files,
  category,
  userId,
}: FileUploadMultiplePayload): Promise<IFile[]> => {
  const formData = new FormData();

  appendFiles(formData, 'files', files);

  const params = new URLSearchParams();

  if (userId) {
    params.append('userId', userId);
  }

  if (category) {
    params.append('category', category);
  }

  const response = await agentClass.post<UploadMultipleFilesApiResponse>(
    `/files/upload/multiple?${params.toString()}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return normalizeFilesResponse(response.data) as IFile[];
};

export const getFileMetadata = async (id: string): Promise<IFile> =>
  await agent.get(`/files/meta/${id}`);

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

  return normalizeFileResponse(response.data) as IFile;
};

export const deleteFile = async (id: string): Promise<void> => {
  await agent.delete(`/files/${id}`);
};
