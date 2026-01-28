import { ViewProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

export function AnimatedProgress({
  currentStep,
  totalSteps,
  props,
}: {
  currentStep: number;
  totalSteps: number;
  props?: ViewProps;
}) {
  const safeTotal = totalSteps > 0 ? totalSteps : 1;
  const safeCurrent = Math.min(Math.max(currentStep, 0), safeTotal);
  const progress = (safeCurrent / safeTotal) * 100;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(`${progress}%`, { damping: 15, stiffness: 100 }),
    };
  });

  return (
    <Animated.View
      className="h-full bg-primary rounded-full"
      style={animatedStyle}
      {...props}
    />
  );
}
