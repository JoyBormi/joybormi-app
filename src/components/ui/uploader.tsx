// components/UploadField.tsx
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import Icons from '@/components/icons';

import { PressableBounce } from './pressable-bounce';

interface UploadFieldProps {
  value?: string;
  onChange: (v: string) => void;
}

export function UploadField({ value, onChange }: UploadFieldProps) {
  async function pickImage(onChange: (value: string) => void) {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      onChange(result.assets[0].uri);
    }
  }

  return (
    <PressableBounce
      onPress={() => pickImage(onChange)}
      className="h-40 rounded-xl border-2 border-dashed border-border bg-muted/30 items-center justify-center overflow-hidden"
    >
      {value ? (
        <>
          <Image
            source={{ uri: value }}
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
