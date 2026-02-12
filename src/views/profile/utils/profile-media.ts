import { normalizeFileUrl } from '@/hooks/files';
import { buildUploadedFile } from '@/lib/utils';
import { toast } from '@/providers/toaster';
import { actionChip } from '@/stores/use-action-chip-store';
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
    const chipId = `image-upload-${ownerType}-${ownerId}-${category}`;

    try {
      actionChip.show({ id: chipId, text: 'Uploading image...', progress: 10 });
      const file = buildUploadedFile(uri, category);
      const uploadedFile = await uploadFile({
        file,
        category,
        ownerId,
        ownerType,
      });
      actionChip.update({ id: chipId, progress: 70 });

      if (!uploadedFile.url) {
        throw new Error('upload_failed');
      }

      const uploadedUrl = normalizeFileUrl(uploadedFile.url);

      if (!uploadedUrl) {
        throw new Error('upload_failed');
      }

      await onUpdate(uploadedUrl);
      actionChip.update({ id: chipId, text: 'Upload complete', progress: 100 });
      setTimeout(() => actionChip.hide(chipId), 500);
    } catch {
      actionChip.hide(chipId);
      toast.error({ title: onErrorMessage ?? 'Something went wrong' });
    }
  };
