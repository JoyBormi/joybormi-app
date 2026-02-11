import { useCallback, useMemo, useState } from 'react';

import { buildUploadedFile } from '@/lib/utils';
import { toast } from '@/providers/toaster';
import { FileOwnerType, IFile } from '@/types/file.type';

type UploadFileFn = (payload: {
  file: ReturnType<typeof buildUploadedFile>;
  category?: string;
  ownerId?: string;
  ownerType?: FileOwnerType;
}) => Promise<{ id?: string; url?: string }>;

type DeleteFileFn = (fileId: string) => Promise<void>;

type UseProfileGalleryParams = {
  ownerId?: string;
  ownerType: FileOwnerType;
  photos?: IFile[];
  uploadFile: UploadFileFn;
  deleteFile: DeleteFileFn;
  defaultCategory: string;
  fileNamePrefix: string;
  onRefresh: () => void;
  onErrorMessage?: string;
};

export const useProfileGallery = ({
  ownerId,
  ownerType,
  photos,
  uploadFile,
  deleteFile,
  defaultCategory,
  fileNamePrefix,
  onRefresh,
  onErrorMessage,
}: UseProfileGalleryParams) => {
  const [selectedPhoto, setSelectedPhoto] = useState<IFile | null>(null);
  const mergedPhotos = useMemo(() => photos ?? [], [photos]);

  const handleUploadPhotos = useCallback(
    async (newPhotos: { uri: string; category: string }[]) => {
      if (!ownerId || newPhotos.length === 0) return;

      try {
        await Promise.all(
          newPhotos.map((photo, index) =>
            uploadFile({
              file: buildUploadedFile(photo.uri, `${fileNamePrefix}-${index}`),
              category: photo.category ?? defaultCategory,
              ownerId,
              ownerType,
            }),
          ),
        );

        if (selectedPhoto?.id) {
          await deleteFile(selectedPhoto.id);
          setSelectedPhoto(null);
        }

        onRefresh();
      } catch {
        toast.error({ title: onErrorMessage ?? 'Something went wrong' });
      }
    },
    [
      defaultCategory,
      deleteFile,
      fileNamePrefix,
      onErrorMessage,
      onRefresh,
      ownerId,
      ownerType,
      selectedPhoto?.id,
      uploadFile,
    ],
  );

  const handleDeletePhoto = useCallback(
    async (fileId: string) => {
      if (!ownerId || !fileId) return;
      try {
        await deleteFile(fileId);
        onRefresh();
      } catch {
        toast.error({ title: onErrorMessage ?? 'Something went wrong' });
      }
    },
    [deleteFile, onErrorMessage, onRefresh, ownerId],
  );

  return {
    selectedPhoto,
    setSelectedPhoto,
    mergedPhotos,
    handleUploadPhotos,
    handleDeletePhoto,
  };
};
