import dayjs from 'dayjs';
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

  // Sync initial position
  useEffect(() => {
    const index = items.indexOf(value);
    if (index !== -1) {
      scrollY.value = index * -ITEM_HEIGHT;
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
      const minScroll = -(items.length - 1) * ITEM_HEIGHT;
      const newScroll = contextY.value + event.translationY;

      // Add rubber-band resistance at boundaries
      if (newScroll > 0) {
        scrollY.value = newScroll * 0.3;
      } else if (newScroll < minScroll) {
        scrollY.value = minScroll + (newScroll - minScroll) * 0.3;
      } else {
        scrollY.value = newScroll;
      }

      // Haptic feedback during scroll (throttled)
      const currentIndex = Math.round(Math.abs(scrollY.value / ITEM_HEIGHT));
      if (currentIndex !== lastHapticIndex.value) {
        lastHapticIndex.value = currentIndex;
        runOnJS(triggerHaptic)();
      }
    })
    .onEnd((event) => {
      const minScroll = -(items.length - 1) * ITEM_HEIGHT;
      const currentScroll = scrollY.value;

      // Calculate target with velocity
      let target: number;
      if (Math.abs(event.velocityY) > 500) {
        // Fast scroll - use decay for natural deceleration
        const decayEnd = currentScroll + event.velocityY * 0.15;
        target = Math.round(decayEnd / ITEM_HEIGHT) * ITEM_HEIGHT;
      } else {
        // Slow scroll - snap to nearest
        target = Math.round(currentScroll / ITEM_HEIGHT) * ITEM_HEIGHT;
      }

      const clampedTarget = Math.max(Math.min(target, 0), minScroll);
      const finalIndex = Math.abs(clampedTarget / ITEM_HEIGHT);

      scrollY.value = withSpring(clampedTarget, SPRING_CONFIG, (finished) => {
        if (finished) {
          isScrolling.value = false;
          runOnJS(notifyChange)(items[finalIndex]);
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
    const itemOffset = index * ITEM_HEIGHT + scrollY.value;
    const centerOffset = (VISIBLE_ITEMS / 2 - 0.5) * ITEM_HEIGHT;
    const distanceFromCenter = Math.abs(itemOffset - centerOffset);

    return {
      opacity: interpolate(
        distanceFromCenter,
        [0, ITEM_HEIGHT, ITEM_HEIGHT * 2],
        [1, 0.5, 0.15],
        Extrapolation.CLAMP,
      ),
      transform: [
        { translateY: itemOffset },
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
  const sanitized = useMemo(() => {
    const d = dayjs(value, 'HH:mm');
    const valid = d.isValid() ? d : dayjs().hour(0).minute(0);
    return { h: valid.format('HH'), m: valid.format('mm') };
  }, [value]);

  const hours = useMemo(
    () => Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')),
    [],
  );
  const minutes = useMemo(
    () => Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')),
    [],
  );

  const handleHourChange = useCallback(
    (newH: string) => {
      onChange(`${newH}:${sanitized.m}`);
    },
    [sanitized.m, onChange],
  );

  const handleMinChange = useCallback(
    (newM: string) => {
      onChange(`${sanitized.h}:${newM}`);
    },
    [sanitized.h, onChange],
  );

  return (
    <View className="p-6 drop-shadow-[0_0_20px_rgba(0,0,0,0.1)]">
      <View className="flex-row items-center justify-center bg-muted/10 backdrop-blur-sm drop-shadow-[0_0_20px_rgba(0,0,0,0.1)] shadow-[0_0_20px_rgba(0,0,0,0.1)] rounded-[32px] overflow-hidden">
        <Wheel items={hours} value={sanitized.h} onChange={handleHourChange} />
        <View className="z-10 bg-transparent px-1">
          <Text className="text-3xl font-bold text-muted-foreground/50">:</Text>
        </View>
        <Wheel items={minutes} value={sanitized.m} onChange={handleMinChange} />

        {/* Selection Indicator */}
        <View
          pointerEvents="none"
          className="absolute left-4 right-4 shadow-[0_0_20px_rgba(0,0,0,0.1)] bg-primary/5"
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
