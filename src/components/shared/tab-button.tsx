import { TabTriggerSlotProps } from 'expo-router/ui';
import React, { useCallback } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useColorScheme } from '@/hooks/common/use-color-scheme';
import { Feedback } from '@/lib/haptics';
import Icons, { TIcon } from '@/lib/icons';
import { cn } from '@/lib/utils';

type Props = TabTriggerSlotProps & {
  icon: TIcon;
};

export function TabButton({ isFocused, icon, children, ...props }: Props) {
  const { colors } = useColorScheme();

  const containerAnim = useAnimatedStyle(() => {
    'worklet';
    return {
      paddingHorizontal: withTiming(isFocused ? 6 : 0, {
        duration: 400,
      }),
      paddingVertical: 10,
      borderRadius: 999,
    };
  });

  const textAnim = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(isFocused ? 0 : 20, {
          duration: 120,
        }),
      },
    ],
    opacity: withTiming(isFocused ? 1 : 0, { duration: 120 }),
    fontWeight: withTiming(isFocused ? '600' : '500', { duration: 120 }),
  }));

  const iconAnim = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withDelay(
          130,
          isFocused
            ? withSequence(
                withTiming(1.2, { duration: 150 }),
                withTiming(0.9, { duration: 150 }),
                withTiming(1.1, { duration: 150 }),
                withTiming(1, { duration: 100 }),
              )
            : withTiming(1, { duration: 0 }),
        ),
      },
    ],
  }));

  const handlePressIn = useCallback(() => {
    Feedback.selection();
  }, []);

  const IconComponent = Icons[icon];

  return (
    <Animated.View
      style={[
        containerAnim,
        { backgroundColor: isFocused ? colors.primary : 'transparent' },
      ]}
    >
      <Pressable
        {...props}
        className="flex-row items-center gap-2 px-3"
        onPressIn={handlePressIn}
        hitSlop={12}
      >
        <Animated.View style={iconAnim}>
          <IconComponent
            className={cn(
              'w-3 h-3 shrink-0',
              isFocused
                ? 'text-primary-foreground stroke-2'
                : 'text-muted-foreground stroke-1',
            )}
          />
        </Animated.View>
        {isFocused && (
          <Animated.Text
            style={textAnim}
            className="text-body leading-body text-primary-foreground"
          >
            {children}
          </Animated.Text>
        )}
      </Pressable>
    </Animated.View>
  );
}
