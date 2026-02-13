import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { PressableBounce, Text } from '@/components/ui';
import { Major } from '@/constants/enum';
import { cn } from '@/lib/utils';

const emojiMap = ['💇‍♂️', '🧖‍♀️', '🦷', '🏋️', '🧘‍♂️', '🎨', '👨‍⚕️', '🧪'];

const MAJOR_CATEGORIES = Object.values(Major)
  .slice(0, 8)
  .map((id, index) => ({
    id,
    emoji: emojiMap[index],
  }));

interface Props {
  className?: string;
}

export function CategoryPills({ className }: Props) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View className={cn('mt-10 px-4', className)}>
      <View className="flex-row flex-wrap items-center justify-between gap-x-2 gap-y-3">
        {MAJOR_CATEGORIES.map((category, index) => (
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 150 + index * 100 }}
            key={category.id}
            className="w-[22%]"
          >
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/(category)/[category]',
                  params: {
                    category: category.id,
                    searchTarget: 'services',
                  },
                })
              }
              className="aspect-square items-center justify-center bg-card/50 rounded-xl border border-border active:opacity-80"
            >
              <Animated.View
                entering={FadeIn.delay(100 + index * 100)}
                className="items-center"
              >
                <Text className="text-2xl mb-2">{category.emoji}</Text>
                <Text className="font-caption line-clamp-1 px-2 text-muted-foreground text-center">
                  {t(`major.${category.id}`)}
                </Text>
              </Animated.View>
            </Pressable>
          </MotiView>
        ))}
      </View>

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 750 }}
      >
        <PressableBounce
          haptic
          onPress={() =>
            router.push({
              pathname: '/(category)/[category]',
              params: {
                category: 'all',
                searchTarget: 'services',
              },
            })
          }
          className="py-2.5 mt-4 items-center justify-center bg-card/50 rounded-2xl border border-border active:opacity-80"
        >
          <Text>{t('categories.seeAll')}</Text>
        </PressableBounce>
      </MotiView>
    </View>
  );
}
