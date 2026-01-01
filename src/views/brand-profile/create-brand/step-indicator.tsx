import { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { Text } from '@/components/ui';
import Icons from '@/lib/icons';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps?: { label: string; id: string; icon?: LucideIcon }[];
}

// Default steps if none provided
const DEFAULT_STEPS = [
  { label: 'SETUP', id: '01', icon: Icons.FileText },
  { label: 'LOCATE', id: '02', icon: Icons.MapPin },
  { label: 'DETAILS', id: '03', icon: Icons.Shield },
  { label: 'VERIFY', id: '04', icon: Icons.CheckCircle },
];

export function StepIndicator({
  currentStep,
  totalSteps = 4,
  steps = DEFAULT_STEPS,
}: StepIndicatorProps) {
  return (
    <View className="flex-row justify-between items-start mt-6 pb-6 border-b border-border w-full mb-8">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <View key={index} className="items-center flex-1 z-10">
            {/* The Box */}
            <AnimatedBox
              isActive={isActive}
              isCompleted={isCompleted}
              icon={step.icon as LucideIcon}
            />

            {/* The Label */}
            <View className="px-2 py-1 rounded-lg">
              <Text
                className={cn(
                  'font-caption text-center',
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
    </View>
  );
}

function AnimatedBox({
  isActive,
  isCompleted,
  icon: Icon,
}: {
  isActive: boolean;
  isCompleted: boolean;
  icon?: LucideIcon;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(isActive ? 1.1 : 1, { damping: 12 }) },
        { translateY: withSpring(isActive ? -2 : 0, { damping: 12 }) },
      ],
    };
  });

  if (!Icon) return null;

  return (
    <Animated.View
      style={animatedStyle}
      className={cn(
        'w-14 h-14 rounded-2xl justify-center items-center mb-2',
        isActive
          ? 'bg-primary/30 dark:bg-primary/30'
          : isCompleted
            ? 'bg-primary/10 dark:bg-primary/20'
            : 'bg-muted/20',
      )}
    >
      {isCompleted ? (
        <Icons.Check className="text-primary" size={20} strokeWidth={3} />
      ) : (
        <Icon
          className={cn(isActive ? 'text-primary' : 'text-muted-foreground')}
          size={18}
        />
      )}
    </Animated.View>
  );
}
