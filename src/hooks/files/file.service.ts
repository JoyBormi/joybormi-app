import { appConfig } from '@/config/app.config';
import { agent, agentClass } from '@/lib/agent';

import type {
  FileOwnerType,
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

export const normalizeFileUrl = (url?: string): string => {
  const r2Url = appConfig.api.r2BaseUrl;

  if (!url) return '';

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
  category,
  ownerId,
  ownerType,
}: FileUploadPayload): Promise<IFile> => {
  const formData = new FormData();

  // Append the actual file to FormData
  appendFile(formData, 'file', file);

  // Build query parameters for metadata
  const params = new URLSearchParams();

  if (ownerId) {
    params.append('ownerId', ownerId);
  }

  if (ownerType) {
    params.append('ownerType', ownerType);
  }

  if (category) {
    params.append('category', category);
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
  ownerId,
  ownerType,
}: FileUploadMultiplePayload): Promise<IFile[]> => {
  const uploads = await Promise.all(
    files.map((file) =>
      uploadFile({
        file,
        category,
        ownerId,
        ownerType,
      }),
    ),
  );

  return normalizeFilesResponse(uploads);
};

export const getFileMetadata = async (id: string): Promise<IFile> =>
  await agent.get(`/files/${id}`);

export const getFilesByCategory = async ({
  ownerId,
  category,
}: {
  ownerId: string;
  category?: string;
}): Promise<IFile[]> => {
  const files = await agent.get<IFile[]>(`/brand/${ownerId}/photos`);
  if (!category) return files;
  return files.filter((file) => file.category === category);
};

export const updateFileMetadata = async (
  id: string,
  payload: UpdateFileMetadataPayload,
): Promise<IFile> => await agent.patch(`/files/${id}`, payload);

export const replaceFile = async ({
  id,
  file,
  ownerId,
  ownerType,
  category,
}: {
  id: string;
  file: UploadedFile;
  ownerId: string;
  ownerType: FileOwnerType;
  category?: string;
}): Promise<IFile> => {
  const uploadedFile = await uploadFile({
    file,
    ownerId,
    ownerType,
    category,
  });

  await deleteFile(id);

  return uploadedFile;
};

export const deleteFile = async (id: string): Promise<void> => {
  await agent.delete(`/files/${id}`);
};
