import { useCallback, useMemo, useState } from 'react';

import { buildUploadedFile } from '@/lib/utils';
import { toast } from '@/providers/toaster';
import { FileOwnerType, IFile } from '@/types/file.type';

import { createImageUploadHandler } from '../utils/profile-media';

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
  defaultPhotoCategory: string;
  photoFileNamePrefix: string;
  onRefreshPhotos: () => void;
  onErrorMessage?: string;
  bannerCategory: string;
  avatarCategory: string;
  onUploadBannerUrl: (url: string) => Promise<void>;
  onUploadAvatarUrl: (url: string) => Promise<void>;
};

export const useProfileGallery = ({
  ownerId,
  ownerType,
  photos,
  uploadFile,
  deleteFile,
  defaultPhotoCategory,
  photoFileNamePrefix,
  onRefreshPhotos,
  onErrorMessage,
  bannerCategory,
  avatarCategory,
  onUploadBannerUrl,
  onUploadAvatarUrl,
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
              file: buildUploadedFile(
                photo.uri,
                `${photoFileNamePrefix}-${index}`,
              ),
              category: photo.category ?? defaultPhotoCategory,
              ownerId,
              ownerType,
            }),
          ),
        );

        if (selectedPhoto?.id) {
          await deleteFile(selectedPhoto.id);
          setSelectedPhoto(null);
        }

        onRefreshPhotos();
      } catch {
        toast.error({ title: onErrorMessage ?? 'Something went wrong' });
      }
    },
    [
      defaultPhotoCategory,
      deleteFile,
      photoFileNamePrefix,
      onErrorMessage,
      onRefreshPhotos,
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
        onRefreshPhotos();
      } catch {
        toast.error({ title: onErrorMessage ?? 'Something went wrong' });
      }
    },
    [deleteFile, onErrorMessage, onRefreshPhotos, ownerId],
  );

  const handleUploadBanner = useMemo(
    () =>
      createImageUploadHandler({
        ownerId,
        ownerType,
        category: bannerCategory,
        uploadFile,
        onUpdate: onUploadBannerUrl,
        onErrorMessage,
      }),
    [
      bannerCategory,
      onErrorMessage,
      onUploadBannerUrl,
      ownerId,
      ownerType,
      uploadFile,
    ],
  );

  const handleUploadProfileImage = useMemo(
    () =>
      createImageUploadHandler({
        ownerId,
        ownerType,
        category: avatarCategory,
        uploadFile,
        onUpdate: onUploadAvatarUrl,
        onErrorMessage,
      }),
    [
      avatarCategory,
      onErrorMessage,
      onUploadAvatarUrl,
      ownerId,
      ownerType,
      uploadFile,
    ],
  );

  return {
    selectedPhoto,
    setSelectedPhoto,
    mergedPhotos,
    handleUploadPhotos,
    handleDeletePhoto,
    handleUploadBanner,
    handleUploadProfileImage,
  };
};
