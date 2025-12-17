import { Text } from '@/components/ui';
import { useUserLocation } from '@/hooks/common/use-location';
import Icons from '@/lib/icons';
import { cn } from '@/lib/utils';
import { Link } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, TouchableOpacity, View } from 'react-native';

interface Props {
  user?: {
    name: string;
    avatar: string;
    address: string;
  };

  className?: string;
}

export function Header({ user, className }: Props) {
  const { location, reloadLocation, isLoading } = useUserLocation();
  const { t } = useTranslation();

  const LocationDisplay = (
    <TouchableOpacity
      onPress={reloadLocation}
      className="flex-row items-center"
      hitSlop={10}
    >
      <Icons.MapPin size={14} className="text-muted-foreground mr-1" />
      <Text numberOfLines={1} className="font-caption text-muted-foreground">
        {isLoading ? t('common.labels.searching') : location}
      </Text>
      <Icons.RefreshCcw
        size={10}
        className="text-muted-foreground/80 ml-2 active:animate-spin stroke-1"
      />
    </TouchableOpacity>
  );

  return (
    <MotiView
      from={{ opacity: 0, translateY: -10 }}
      animate={{ opacity: 1, translateY: 0 }}
      className={cn('px-4 mt-2', className)}
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
                  Hello, {user.name}
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
                <Text className="font-subtitle text-foreground">Joy Bormi</Text>
              </View>
              <View className="mt-1">{LocationDisplay}</View>
            </View>

            <Link href="/(auth)/register" asChild>
              <Pressable className="bg-primary px-5 py-2.5 rounded-full">
                <Text className="font-caption text-primary-foreground">
                  Register
                </Text>
              </Pressable>
            </Link>
          </>
        )}
      </View>
    </MotiView>
  );
}
