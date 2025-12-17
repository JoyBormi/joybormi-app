import { Text } from '@/components/ui';
import { cn } from '@/lib/utils';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps?: { label: string; id: string }[];
}

// Default steps if none provided
const DEFAULT_STEPS = [
  { label: 'SETUP', id: '01' },
  { label: 'LOCATE', id: '02' },
  { label: 'DETAILS', id: '03' },
  { label: 'VERIFY', id: '04' },
];

export function StepIndicator({
  currentStep,
  totalSteps = 4,
  steps = DEFAULT_STEPS,
}: StepIndicatorProps) {
  return (
    <View className="w-full">
      {/* Top Section: Steps */}
      <View className="flex-row justify-between items-start mb-6">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <View key={index} className="items-center flex-1 z-10">
              {/* The Box */}
              <AnimatedBox
                isActive={isActive}
                isCompleted={isCompleted}
                index={index}
              />

              {/* The Label */}
              <View className="px-2 py-1 rounded-lg">
                <Text
                  className={cn(
                    'text-[10px] font-medium',
                    isActive
                      ? 'text-primary font-bold'
                      : isCompleted
                        ? 'text-foreground'
                        : 'text-muted-foreground',
                  )}
                >
                  {step.label}
                </Text>
              </View>
            </View>
          );
        })}

        {/* Connector Line (Background visual) */}
        <View className="absolute top-7 left-0 right-0 h-0.5 bg-muted/30 -z-10 mt-[1px]" />
      </View>

      {/* Progress Bar */}
      <View className="bg-card/50 dark:bg-card/30 p-4 rounded-2xl backdrop-blur-sm">
        <View className="flex-row justify-between mb-2">
          <Text className="font-caption text-muted-foreground">Progress</Text>
          <Text className="font-caption text-foreground font-medium">
            {Math.round(((currentStep + 1) / totalSteps) * 100)}%
          </Text>
        </View>
        <View className="h-2 w-full bg-muted/20 rounded-full relative overflow-hidden">
          <AnimatedProgress currentStep={currentStep} totalSteps={totalSteps} />
        </View>
      </View>
    </View>
  );
}

function AnimatedProgress({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(`${progress}%`, { damping: 15, stiffness: 100 }),
    };
  });

  return (
    <Animated.View
      className="h-full bg-primary rounded-full"
      style={animatedStyle}
    />
  );
}

function AnimatedBox({
  isActive,
  isCompleted,
  index,
}: {
  isActive: boolean;
  isCompleted: boolean;
  index: number;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(isActive ? 1.1 : 1, { damping: 12 }) },
        { translateY: withSpring(isActive ? -2 : 0, { damping: 12 }) },
      ],
    };
  });

  return (
    <Animated.View
      style={animatedStyle}
      className={cn(
        'w-12 h-12 rounded-2xl justify-center items-center mb-2',
        isActive
          ? 'bg-primary/20 dark:bg-primary/30'
          : isCompleted
            ? 'bg-primary/10 dark:bg-primary/20'
            : 'bg-muted/20',
      )}
    >
      <Text
        className={cn(
          'font-bold text-base',
          isActive
            ? 'text-primary'
            : isCompleted
              ? 'text-primary'
              : 'text-muted-foreground',
        )}
      >
        {isCompleted ? '✓' : `0${index + 1}`}
      </Text>
    </Animated.View>
  );
}
