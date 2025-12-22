import React from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  Easing,
  SharedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const COLLAPSED_HEIGHT = 0;
const EXPANDED_HEIGHT = 360;

/**
 * Draggable Knob Component
 */
export function DraggableKnob({
  height,
  sheetHeight,
}: {
  height: SharedValue<number>;
  sheetHeight: SharedValue<number>;
}) {
  const startHeight = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startHeight.value = height.value;
    })
    .onUpdate((e) => {
      const next = startHeight.value + e.translationY;
      height.value = Math.max(
        COLLAPSED_HEIGHT,
        Math.min(EXPANDED_HEIGHT, next),
      );
    })
    .onEnd((e) => {
      const VELOCITY_THRESHOLD = 900;

      if (e.velocityY > VELOCITY_THRESHOLD) {
        // fast downward swipe → open
        sheetHeight.value = withTiming(EXPANDED_HEIGHT, {
          duration: 200,
          easing: Easing.out(Easing.cubic),
        });
        return;
      }

      if (e.velocityY < -VELOCITY_THRESHOLD) {
        // fast upward swipe → close
        sheetHeight.value = withTiming(COLLAPSED_HEIGHT, {
          duration: 200,
          easing: Easing.out(Easing.cubic),
        });
        return;
      }

      // fallback to percentage rule
      const progress = sheetHeight.value / EXPANDED_HEIGHT;
      const shouldOpen = progress > 0.4;

      sheetHeight.value = withTiming(
        shouldOpen ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
        {
          duration: 220,
          easing: Easing.out(Easing.cubic),
        },
      );
    });

  return (
    <GestureDetector gesture={panGesture}>
      <View className="items-center py-3 bg-transparent">
        <View className="w-12 h-1.5 rounded-full bg-muted-foreground/40" />
      </View>
    </GestureDetector>
  );
}
