import type { UploadedFile } from '@/utils/file-upload';

export interface IFile {
  category: string;
  createdAt: string;
  description: string;
  filename: string;
  id: string;
  mimeType: string;
  originalName: string;
  size: number;
  updatedAt: string;
  url: string;
}

export interface IFileUpload extends Omit<
  IFile,
  'id' | 'createdAt' | 'updatedAt'
> {
  id?: string;
}

export interface FileUploadPayload {
  file: UploadedFile;
  category?: string;
  description?: string;
  userId?: string;
}

export interface FileUploadMultiplePayload {
  files: UploadedFile[];
  category?: string;
  userId?: string;
}

export interface UpdateFileMetadataPayload {
  description?: string;
  category?: string;
  userId?: string;
}
