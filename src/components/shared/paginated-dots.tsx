import { memo } from "react";
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";

export const PaginationDot = memo(({
  index,
  scrollX,
  CARD_WIDTH,
}: {
  index: number;
  scrollX: SharedValue<number>;
  CARD_WIDTH: number;
}) => {
  const animatedDotStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];

    return {
      width: interpolate(
        scrollX.value,
        inputRange,
        [6, 20, 6],
        Extrapolation.CLAMP,
      ),
      opacity: interpolate(
        scrollX.value,
        inputRange,
        [0.5, 1, 0.5],
        Extrapolation.CLAMP,
      ),
    };
  });

  return (
    <Animated.View
      style={animatedDotStyle}
      className="mx-0.5 h-1.5 rounded-full bg-muted"
    />
  );
});

PaginationDot.displayName = 'PaginationDot';