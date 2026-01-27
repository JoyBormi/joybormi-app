import React, { useCallback, useState } from 'react';
import { Image, Text, View } from 'react-native';

import Icons from '@/components/icons';
import { useGlobalFileUpload } from '@/hooks/common';
import { cn } from '@/lib/utils';
import {
  pickImage,
  pickMultipleImages,
  type ImagePickerOptions,
  type UploadedFile,
} from '@/utils/file-upload';

import { PressableBounce } from './pressable-bounce';

interface FileUploaderBaseProps {
  endpoint: string;
  fieldName?: string;
  multiple?: boolean;
  disabled?: boolean;
  autoUpload?: boolean;
  title?: string;
  description?: string;
  buttonLabel?: string;
  className?: string;
  pickerOptions?: ImagePickerOptions;
  metadata?: Record<string, string | number | boolean>;
  onFilesSelected?: (files: UploadedFile | UploadedFile[]) => void;
  onProgress?: (progress: number) => void;
  onUploadError?: (error: Error) => void;
}

interface FileUploaderProps<TResponse> extends FileUploaderBaseProps {
  onUploadComplete?: (
    response: TResponse,
    files: UploadedFile | UploadedFile[],
  ) => void;
}

export function FileUploader<TResponse = { url: string }>({
  endpoint,
  fieldName,
  multiple = false,
  disabled = false,
  autoUpload = true,
  title = 'Upload Files',
  description = 'PNG or JPG (Max 5MB)',
  buttonLabel = 'Tap to upload',
  className,
  pickerOptions,
  metadata,
  onFilesSelected,
  onProgress,
  onUploadError,
  onUploadComplete,
}: FileUploaderProps<TResponse>) {
  const { progress, isUploading, uploadFile, uploadFiles } =
    useGlobalFileUpload<TResponse>();
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [selectedCount, setSelectedCount] = useState(0);

  const handleUpload = useCallback(
    async (files: UploadedFile | UploadedFile[]) => {
      try {
        if (Array.isArray(files)) {
          const response = await uploadFiles(files, {
            endpoint,
            fieldName,
            onProgress,
            metadata,
          });
          onUploadComplete?.(response, files);
        } else {
          const response = await uploadFile(files, {
            endpoint,
            fieldName,
            onProgress,
            metadata,
          });
          onUploadComplete?.(response, files);
        }
      } catch (error) {
        onUploadError?.(error as Error);
      }
    },
    [
      endpoint,
      fieldName,
      metadata,
      onProgress,
      onUploadComplete,
      onUploadError,
      uploadFile,
      uploadFiles,
    ],
  );

  const handlePick = useCallback(async () => {
    if (disabled || isUploading) return;

    const pickedFiles = multiple
      ? await pickMultipleImages(pickerOptions)
      : await pickImage(pickerOptions);

    if (!pickedFiles || (Array.isArray(pickedFiles) && !pickedFiles.length)) {
      return;
    }

    if (Array.isArray(pickedFiles)) {
      setSelectedCount(pickedFiles.length);
      setPreviewUri(pickedFiles[0]?.uri ?? null);
      onFilesSelected?.(pickedFiles);
      if (autoUpload) {
        await handleUpload(pickedFiles);
      }
    } else {
      setSelectedCount(1);
      setPreviewUri(pickedFiles.uri);
      onFilesSelected?.(pickedFiles);
      if (autoUpload) {
        await handleUpload(pickedFiles);
      }
    }
  }, [
    autoUpload,
    disabled,
    handleUpload,
    isUploading,
    multiple,
    onFilesSelected,
    pickerOptions,
  ]);

  return (
    <PressableBounce
      onPress={handlePick}
      className={cn(
        'rounded-2xl border-2 border-dashed border-border bg-muted/30 items-center justify-center overflow-hidden px-4 py-6 gap-3',
        disabled && 'opacity-60',
        className,
      )}
    >
      {previewUri ? (
        <View className="w-full gap-3">
          <View className="w-full h-40 overflow-hidden rounded-xl">
            <Image
              source={{ uri: previewUri }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <Text className="text-sm text-muted-foreground font-body text-center">
            {multiple ? `${selectedCount} files selected` : '1 file selected'}
          </Text>
        </View>
      ) : (
        <View className="items-center gap-2">
          <Icons.Upload className="text-muted-foreground" size={36} />
          <Text className="text-base font-medium text-foreground">{title}</Text>
          <Text className="text-sm text-muted-foreground text-center">
            {description}
          </Text>
          <Text className="text-sm text-primary font-subtitle">
            {buttonLabel}
          </Text>
        </View>
      )}

      {isUploading && (
        <View className="w-full gap-2">
          <View className="w-full h-2 rounded-full bg-muted/40 overflow-hidden">
            <View
              className="h-full bg-primary"
              style={{ width: `${progress}%` }}
            />
          </View>
          <Text className="text-xs text-muted-foreground font-body text-center">
            Uploading... {progress}%
          </Text>
        </View>
      )}
    </PressableBounce>
  );
}
