// components/UploadField.tsx
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import Icons from '@/components/icons';
import { IMAGE_CATEGORIES } from '@/constants/global.constants';
import { useUploadFile } from '@/hooks/files';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores';
import { FileOwnerType, IFile } from '@/types/file.type';

import { PressableBounce } from './pressable-bounce';

interface UploadFieldProps {
  value?: string;
  onChange: (v: string) => void;
}

export function UploadField({ value, onChange }: UploadFieldProps) {
  const { user } = useUserStore();
  const { mutateAsync: uploadFile, isPending } = useUploadFile();
  const [tempValue, setTempValue] = useState<string | undefined>(value);

  async function pickImage() {
    if (isPending) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];
    setTempValue(asset.uri);

    await uploadFile(
      {
        file: {
          uri: asset.uri,
          name: asset.fileName ?? 'upload.jpg',
          type: asset.mimeType ?? 'image/jpeg',
        },
        ownerId: user?.id,
        ownerType: user?.role as FileOwnerType,
        category: IMAGE_CATEGORIES.business_cert,
      },
      {
        onSuccess: (data: IFile) => {
          onChange(data.url);
        },
        onError: () => {
          setTempValue(undefined);
        },
      },
    );
  }

  return (
    <PressableBounce
      disabled={isPending}
      onPress={pickImage}
      className={cn(
        'h-40 rounded-xl border-2 border-dashed border-border bg-muted/30 items-center justify-center overflow-hidden',
        isPending && 'opacity-50',
      )}
    >
      {tempValue ? (
        <>
          <Image
            source={{ uri: tempValue }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />

          <Pressable
            onPress={() => onChange('')}
            className="absolute top-2 right-2 bg-black/60 rounded-full p-1"
          >
            <Icons.X size={16} className="text-white" />
          </Pressable>
        </>
      ) : (
        <View className="items-center">
          <Icons.Upload className="text-muted-foreground mb-3" size={36} />
          <Text className="text-base font-medium text-foreground mb-1">
            Upload Document
          </Text>
          <Text className="text-sm text-muted-foreground">
            PDF, JPG, or PNG (Max 5MB)
          </Text>
        </View>
      )}
    </PressableBounce>
  );
}
