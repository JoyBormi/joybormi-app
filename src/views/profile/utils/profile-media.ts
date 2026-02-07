import { normalizeFileUrl } from '@/hooks/files';
import { buildUploadedFile } from '@/lib/utils';
import { toast } from '@/providers/toaster';
import { FileOwnerType } from '@/types/file.type';

type UploadFileFn = (payload: {
  file: ReturnType<typeof buildUploadedFile>;
  category?: string;
  ownerId?: string;
  ownerType?: FileOwnerType;
}) => Promise<{ id?: string; url?: string }>;

type CreateImageUploadHandlerParams = {
  ownerId?: string;
  ownerType: FileOwnerType;
  category: string;
  uploadFile: UploadFileFn;
  onUpdate: (url: string) => Promise<void>;
  onErrorMessage?: string;
};

export const createImageUploadHandler =
  ({
    ownerId,
    ownerType,
    category,
    uploadFile,
    onUpdate,
    onErrorMessage,
  }: CreateImageUploadHandlerParams) =>
  async (uri: string) => {
    if (!ownerId) return;

    try {
      const file = buildUploadedFile(uri, category);
      const uploadedFile = await uploadFile({
        file,
        category,
        ownerId,
        ownerType,
      });

      if (!uploadedFile.url) {
        throw new Error('upload_failed');
      }

      const uploadedUrl = normalizeFileUrl(uploadedFile.url);

      if (!uploadedUrl) {
        throw new Error('upload_failed');
      }

      await onUpdate(uploadedUrl);
    } catch {
      toast.error({ title: onErrorMessage ?? 'Something went wrong' });
    }
  };
