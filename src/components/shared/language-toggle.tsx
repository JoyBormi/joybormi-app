import { cn } from '@/lib/utils';

import { storage } from '@/lib/mmkv';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const langs = ['en-US', 'ru-RU', 'uz-UZ'];

export const LanguageToggle = () => {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;

  const changeLanguage = async (lang: string) => {
    storage.setItem('language', lang);
    i18n.changeLanguage(lang);
  };
  const translateX = useSharedValue(0);
  const width = useSharedValue(0);

  const positions = useRef<Record<string, { x: number; width: number }>>({});
  const [mounted, setMounted] = useState(false);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: width.value,
  }));

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = storage.getItem('language');
      if (savedLanguage) {
        i18n.changeLanguage((savedLanguage as string) ?? 'en-US');
      }
    };
    loadLanguage();
  }, [i18n]);

  useEffect(() => {
    if (mounted && positions.current[currentLanguage]) {
      const { x, width: w } = positions.current[currentLanguage];
      translateX.value = withTiming(x, { duration: 250 });
      width.value = withTiming(w, { duration: 250 });
    }
  }, [currentLanguage, mounted, translateX, width]);

  return (
    <View className="flex-row relative items-center rounded-full bg-muted">
      <Animated.View
        className="absolute h-9 bg-primary rounded-full"
        style={indicatorStyle}
      />
      {langs.map((lng) => (
        <Pressable
          key={lng}
          onPress={() => changeLanguage(lng)}
          onLayout={(e) => {
            const { x, width } = e.nativeEvent.layout;
            positions.current[lng] = { x, width };
            if (Object.keys(positions.current).length === langs.length) {
              setMounted(true);
            }
          }}
          className="h-9 items-center justify-center px-3"
        >
          <Text
            className={cn(
              'capitalize text-caption',
              currentLanguage === lng
                ? 'text-background font-semibold'
                : 'text-muted-foreground font-medium',
            )}
          >
            {t(`common.languages.${lng}`)}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};
