import { Text } from '@/components/ui';
import Icons from '@/lib/icons';
import { useUserStore } from '@/stores';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Link } from 'expo-router';
import { MotiView } from 'moti';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, TouchableOpacity, View } from 'react-native';
import { LocationPickerSheet } from './location-picker';

export function Header() {
  const { t } = useTranslation();
  const { user, location } = useUserStore();
  const sheetRef = useRef<BottomSheetModal>(null);

  const LocationDisplay = (
    <TouchableOpacity
      onPress={() => sheetRef.current?.present()}
      className="flex-row items-center"
      hitSlop={10}
    >
      <Icons.MapPin size={14} className="text-muted-foreground mr-1" />
      <Text numberOfLines={1} className="font-caption text-muted-foreground">
        {location}
      </Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    if (!location) {
      sheetRef.current?.present();
    }
  }, [location]);

  return (
    <MotiView
      from={{ opacity: 0, translateY: -10 }}
      animate={{ opacity: 1, translateY: 0 }}
      className="px-4 mt-2"
    >
      <View className="flex-row items-start justify-between">
        {user ? (
          <>
            <View className="flex-row items-center flex-1">
              <Image
                source={{ uri: user.avatar }}
                className="w-12 h-12 rounded-full border border-border"
              />
              <View className="ml-4 flex-1">
                <Text className="font-subtitle text-foreground">
                  Hello, {user.username}
                </Text>
                <View className="mt-1">{LocationDisplay}</View>
              </View>
            </View>

            <Pressable className="p-3 rounded-full bg-card">
              <Icons.Bell size={22} className="text-muted-foreground" />
            </Pressable>
          </>
        ) : (
          <>
            <View className="flex-1">
              <View className="flex-row items-center">
                <Icons.Scissors className="w-8 h-8 text-primary mr-2" />
                <Text className="font-subtitle text-foreground">
                  Hello, Guest 👋
                </Text>
              </View>
              <View className="mt-1">{LocationDisplay}</View>
            </View>

            <Link href="/(auth)/login" asChild>
              <Pressable className="bg-primary px-5 py-2.5 rounded-full">
                <Text className="font-caption text-primary-foreground">
                  Login
                </Text>
              </Pressable>
            </Link>
          </>
        )}
      </View>
      <LocationPickerSheet ref={sheetRef} />
    </MotiView>
  );
}
