import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { cn } from '@/lib/utils';

/**
 * Grid Category Item for Bottom Sheet
 */
export function CategoryGridItem({
  category,
  emoji,
  isSelected,
  onPress,
}: {
  category: string;
  emoji: string;
  isSelected: boolean;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const scale = useSharedValue(1);

  const springConfig = {
    damping: 15,
    stiffness: 150,
    mass: 0.5,
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const label =
    category === 'all' ? t('categories.all') : t(`major.${category}`);

  return (
    <Animated.View style={animatedStyle} className="w-[31%] mb-3">
      <Pressable
        onPress={onPress}
        onPressIn={() => (scale.value = withSpring(0.92, springConfig))}
        onPressOut={() => (scale.value = withSpring(1, springConfig))}
        className={cn(
          'aspect-square items-center justify-center rounded-2xl border-2',
          isSelected ? 'bg-primary border-primary' : 'bg-card border-border',
        )}
      >
        <Text className="text-3xl mb-2">{emoji}</Text>
        <Text
          numberOfLines={2}
          className={cn(
            'font-semibold text-xs text-center px-2',
            isSelected ? 'text-primary-foreground' : 'text-muted-foreground',
          )}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
