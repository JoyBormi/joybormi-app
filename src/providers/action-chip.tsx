import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui';
import { AnimatedProgress } from '@/components/ui/progress';
import { useActionChipStore } from '@/stores/use-action-chip-store';

export function GlobalActionChip() {
  const insets = useSafeAreaInsets();
  const { visible, text, progress } = useActionChipStore();

  if (!visible) return null;

  return (
    <View
      pointerEvents="none"
      className="absolute left-0 right-0 z-[9999] items-center"
      style={{ top: insets.top + 8 }}
    >
      <Animated.View
        entering={FadeInDown.duration(160)}
        exiting={FadeOutUp.duration(160)}
        className="w-[92%] max-w-[420px] rounded-3xl border border-border/60 bg-card px-4 py-3 shadow-xl"
      >
        <View className="flex-row items-center gap-3">
          {progress === null ? <ActivityIndicator size="small" /> : null}
          <Text className="flex-1 font-body text-foreground">{text}</Text>
          {progress !== null ? (
            <Text className="font-caption text-muted-foreground">
              {progress}%
            </Text>
          ) : null}
        </View>

        {progress !== null ? (
          <View className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
            <AnimatedProgress currentStep={progress} totalSteps={100} />
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
}
