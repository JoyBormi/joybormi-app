import { TabTriggerSlotProps } from 'expo-router/ui';
import React, { useCallback } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { Feedback } from '@/lib/haptics';
import Icons, { TIcon } from '@/lib/icons';
import { cn } from '@/lib/utils';

type Props = TabTriggerSlotProps & {
  icon: TIcon;
};

// Optimized timing for 120 FPS smooth transitions
const FAST_TIMING = {
  duration: 200,
  easing: Easing.out(Easing.cubic),
};

const MEDIUM_TIMING = {
  duration: 250,
  easing: Easing.out(Easing.cubic),
};

export function TabButton({ isFocused, icon, children, ...props }: Props) {
  const containerAnim = useAnimatedStyle(() => {
    'worklet';
    return {
      paddingHorizontal: withTiming(isFocused ? 16 : 12, MEDIUM_TIMING),
      paddingVertical: 10,
      borderRadius: 999,
    };
  });

  const backgroundAnim = useAnimatedStyle(() => ({
    opacity: withTiming(isFocused ? 1 : 0, FAST_TIMING),
  }));

  const textAnim = useAnimatedStyle(() => ({
    width: withTiming(isFocused ? 'auto' : 0, MEDIUM_TIMING),
    marginLeft: withTiming(isFocused ? 8 : 0, MEDIUM_TIMING),
    opacity: withTiming(isFocused ? 1 : 0, FAST_TIMING),
  }));

  const iconAnim = useAnimatedStyle(() => ({
    opacity: withTiming(1, FAST_TIMING),
  }));

  const handlePressIn = useCallback(() => {
    Feedback.selection();
  }, []);

  const IconComponent = Icons[icon];

  return (
    <Animated.View style={[containerAnim]} className="relative">
      {/* Clean background transition */}
      <Animated.View
        style={backgroundAnim}
        className="absolute inset-0 bg-primary rounded-full"
      />

      <Pressable
        {...props}
        className="flex-row items-center relative z-10"
        onPressIn={handlePressIn}
        hitSlop={12}
      >
        <Animated.View style={iconAnim}>
          <IconComponent
            className={cn(
              'w-5 h-5 shrink-0',
              isFocused
                ? 'text-primary-foreground stroke-2'
                : 'text-muted-foreground stroke-[1.5]',
            )}
          />
        </Animated.View>
        {isFocused && (
          <Animated.Text
            style={textAnim}
            className="font-subtitle text-primary-foreground overflow-hidden"
            numberOfLines={1}
          >
            {children}
          </Animated.Text>
        )}
      </Pressable>
    </Animated.View>
  );
}
