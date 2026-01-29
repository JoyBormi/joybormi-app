import type { UploadedFile } from '@/utils/file-upload';

export interface IFile {
  id?: string;
  url?: string;
  path?: string;
  filename?: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  category?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FileUploadPayload {
  file: UploadedFile;
  description?: string;
  category?: string;
}

export interface FileUploadMultiplePayload {
  files: UploadedFile[];
  category?: string;
}

export interface UpdateFileMetadataPayload {
  description?: string;
  category?: string;
}
