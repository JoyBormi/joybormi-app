import React, { useCallback, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Text } from '@/components/ui';
import { Feedback } from '@/lib/haptics';

const ITEM_HEIGHT = 45;
const VISIBLE_ITEMS = 5;
const SPRING_CONFIG = {
  damping: 30,
  stiffness: 200,
  mass: 0.5,
  overshootClamping: true,
};

interface WheelProps {
  items: string[];
  value: string;
  onChange: (val: string) => void;
}

const Wheel = ({ items, value, onChange }: WheelProps) => {
  const scrollY = useSharedValue(0);
  const contextY = useSharedValue(0);
  const lastHapticIndex = useSharedValue(-1);
  const isScrolling = useSharedValue(false);

  // CRITICAL FIX: Initialize scroll position correctly
  useEffect(() => {
    const index = items.indexOf(value);

    if (index !== -1) {
      // To center item at index N:
      // - Item needs to be at centerPosition = (VISIBLE_ITEMS / 2 - 0.5) * ITEM_HEIGHT = 2 * 45 = 90px from top
      // - Item's natural position is index * ITEM_HEIGHT
      // - So scrollY = centerPosition - (index * ITEM_HEIGHT)
      const centerPosition = (VISIBLE_ITEMS / 2 - 0.5) * ITEM_HEIGHT;
      const targetScrollY = centerPosition - index * ITEM_HEIGHT;

      scrollY.value = targetScrollY;
    }
  }, [items, value, scrollY]);

  const triggerHaptic = useCallback(() => {
    Feedback.light();
  }, []);

  const notifyChange = useCallback(
    (newValue: string) => {
      onChange(newValue);
    },
    [onChange],
  );

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isScrolling.value = true;
      contextY.value = scrollY.value;
    })
    .onUpdate((event) => {
      // Calculate scroll boundaries
      // When first item (index 0) is centered: scrollY should be at centerPosition - 0 = 90
      // When last item is centered: scrollY should be at centerPosition - (lastIndex * ITEM_HEIGHT)
      const centerPosition = (VISIBLE_ITEMS / 2 - 0.5) * ITEM_HEIGHT;
      const maxScroll = centerPosition; // First item centered
      const minScroll = centerPosition - (items.length - 1) * ITEM_HEIGHT; // Last item centered

      const newScroll = contextY.value + event.translationY;

      // Apply rubber-band resistance at boundaries
      if (newScroll > maxScroll) {
        // Trying to scroll beyond first item
        scrollY.value = maxScroll + (newScroll - maxScroll) * 0.3;
      } else if (newScroll < minScroll) {
        // Trying to scroll beyond last item
        scrollY.value = minScroll + (newScroll - minScroll) * 0.3;
      } else {
        scrollY.value = newScroll;
      }

      // Calculate which item is currently centered
      const currentItemPosition = centerPosition - scrollY.value;
      const currentIndex = Math.round(currentItemPosition / ITEM_HEIGHT);

      if (
        currentIndex !== lastHapticIndex.value &&
        currentIndex >= 0 &&
        currentIndex < items.length
      ) {
        lastHapticIndex.value = currentIndex;
        runOnJS(triggerHaptic)();
      }
    })
    .onEnd((event) => {
      const centerPosition = (VISIBLE_ITEMS / 2 - 0.5) * ITEM_HEIGHT;
      const maxScroll = centerPosition;
      const minScroll = centerPosition - (items.length - 1) * ITEM_HEIGHT;
      const currentScroll = scrollY.value;

      // Calculate target snap position
      let target: number;
      if (Math.abs(event.velocityY) > 500) {
        // Fast scroll with velocity
        const decayEnd = currentScroll + event.velocityY * 0.15;
        // Find which item position this corresponds to
        const targetItemPos = centerPosition - decayEnd;
        const targetIndex = Math.round(targetItemPos / ITEM_HEIGHT);
        target = centerPosition - targetIndex * ITEM_HEIGHT;
      } else {
        // Slow scroll - snap to nearest item
        const currentItemPos = centerPosition - currentScroll;
        const nearestIndex = Math.round(currentItemPos / ITEM_HEIGHT);
        target = centerPosition - nearestIndex * ITEM_HEIGHT;
      }

      // Clamp target within bounds
      const clampedTarget = Math.max(Math.min(target, maxScroll), minScroll);

      // Calculate final index from clamped position
      const finalItemPos = centerPosition - clampedTarget;
      const finalIndex = Math.round(finalItemPos / ITEM_HEIGHT);
      const safeIndex = Math.max(0, Math.min(finalIndex, items.length - 1));

      scrollY.value = withSpring(clampedTarget, SPRING_CONFIG, (finished) => {
        if (finished) {
          isScrolling.value = false;
          runOnJS(notifyChange)(items[safeIndex]);
        }
      });
    });

  return (
    <View style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }} className="flex-1">
      <GestureDetector gesture={panGesture}>
        <Animated.View className="flex-1">
          {items.map((item, index) => (
            <TimeItem
              key={`${item}-${index}`}
              item={item}
              index={index}
              scrollY={scrollY}
            />
          ))}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const TimeItem = ({
  item,
  index,
  scrollY,
}: {
  item: string;
  index: number;
  scrollY: SharedValue<number>;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    // Item's position on screen = its natural position + scroll offset
    const itemPosition = index * ITEM_HEIGHT + scrollY.value;

    // Center of viewport is at (VISIBLE_ITEMS / 2 - 0.5) * ITEM_HEIGHT = 90px
    const centerPosition = (VISIBLE_ITEMS / 2 - 0.5) * ITEM_HEIGHT;
    const distanceFromCenter = Math.abs(itemPosition - centerPosition);

    return {
      opacity: interpolate(
        distanceFromCenter,
        [0, ITEM_HEIGHT, ITEM_HEIGHT * 2],
        [1, 0.5, 0.15],
        Extrapolation.CLAMP,
      ),
      transform: [
        { translateY: itemPosition },
        {
          scale: interpolate(
            distanceFromCenter,
            [0, ITEM_HEIGHT * 1.5],
            [1.15, 0.85],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        { height: ITEM_HEIGHT, position: 'absolute', width: '100%' },
        animatedStyle,
      ]}
      className="items-center justify-center"
    >
      <Text className="text-2xl font-bold text-foreground">{item}</Text>
    </Animated.View>
  );
};

export const TimePicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  // Parse the time value into hours and minutes
  const sanitized = useMemo(() => {
    const parts = value?.split(':') || [];
    const h = parts[0]?.padStart(2, '0') || '00';
    const m = parts[1]?.padStart(2, '0') || '00';
    return { h, m };
  }, [value]);

  // Generate arrays for hours (00-23) and minutes (00-59)
  const hours = useMemo(
    () => Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')),
    [],
  );
  const minutes = useMemo(
    () => Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')),
    [],
  );

  // Handle hour selection change
  const handleHourChange = useCallback(
    (newH: string) => {
      const newValue = `${newH}:${sanitized.m}`;
      onChange(newValue);
    },
    [sanitized.m, onChange],
  );

  // Handle minute selection change
  const handleMinChange = useCallback(
    (newM: string) => {
      const newValue = `${sanitized.h}:${newM}`;
      onChange(newValue);
    },
    [sanitized.h, onChange],
  );

  return (
    <View className="p-4">
      <View className="flex-row items-center justify-center overflow-hidden">
        {/* Hour wheel */}
        <Wheel items={hours} value={sanitized.h} onChange={handleHourChange} />

        {/* Separator */}
        <View className="z-10 bg-transparent px-1">
          <Text className="text-3xl font-bold text-muted-foreground/50">:</Text>
        </View>

        {/* Minute wheel */}
        <Wheel items={minutes} value={sanitized.m} onChange={handleMinChange} />

        {/* Selection Indicator - highlights the centered/selected item */}
        <View
          pointerEvents="none"
          className="absolute left-4 right-4 shadow-[0_0_20px_rgba(0,0,0,0.5)] bg-primary/5"
          style={{
            height: ITEM_HEIGHT,
            top: '50%',
            marginTop: -ITEM_HEIGHT / 2,
            borderRadius: 8,
          }}
        />
      </View>
    </View>
  );
};
