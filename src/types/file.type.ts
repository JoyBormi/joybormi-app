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

export type FileOwnerType = 'BRAND' | 'WORKER' | 'USER' | 'CREATOR';

export interface IFileUpload extends Omit<
  IFile,
  'id' | 'createdAt' | 'updatedAt'
> {
  id?: string;
}

export interface FileUploadPayload {
  file: UploadedFile;
  ownerId?: string;
  ownerType?: FileOwnerType;
  category?: string;
}

export interface FileUploadMultiplePayload {
  files: UploadedFile[];
  ownerId?: string;
  ownerType?: FileOwnerType;
  category?: string;
}

export interface UpdateFileMetadataPayload {
  description?: string;
  category?: string;
  ownerId?: string;
  ownerType?: FileOwnerType;
}
