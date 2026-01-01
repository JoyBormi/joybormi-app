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
 * Atomic Sub-component: CategoryChip
 */
export function CategoryChip({
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

  // High-fidelity spring config for tactile feel
  const springConfig = {
    damping: 15,
    stiffness: 150,
    mass: 0.5,
  };

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const label =
    category === 'all' ? t('categories.all') : t(`major.${category}`);

  return (
    <Animated.View style={animatedContainerStyle} className="mr-2">
      <Pressable
        onPress={onPress}
        onPressIn={() => (scale.value = withSpring(0.92, springConfig))}
        onPressOut={() => (scale.value = withSpring(1, springConfig))}
        className={cn(
          'px-4 py-2.5 rounded-2xl flex-row items-center gap-2 border transition-colors',
          isSelected
            ? 'bg-primary border-primary shadow-sm'
            : 'bg-card border-border',
        )}
      >
        <Text className="text-base">{emoji}</Text>
        <Text
          className={cn(
            'font-semibold text-sm tracking-tight',
            isSelected ? 'text-primary-foreground' : 'text-muted-foreground',
          )}
        >
          {label}
        </Text>

        {/* Animated Selection Dot */}
        {isSelected && (
          <Animated.View className="w-1.5 h-1.5 rounded-full bg-primary-foreground/50" />
        )}
      </Pressable>
    </Animated.View>
  );
}
