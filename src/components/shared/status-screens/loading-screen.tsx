import { MotiView } from 'moti';
import React from 'react';
import { View } from 'react-native';

import { cn } from '@/lib/utils';

// 1. Define Props for high customizability
interface LoadingScreenProps {
  /** Size of the individual loading dots/bars */
  size?: number;
  /** Background color of the dots (can be overridden by dotClassName) */
  color?: string;
  /** Speed of the animation in ms */
  duration?: number;
  /** Tailwind classes for the main container */
  className?: string;
  /** Tailwind classes for the individual dots */
  dotClassName?: string;
  /** Number of dots to render */
  count?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  size = 16,
  color = '#4F46E5', // Indigo-600 default
  duration = 1000,
  className = '',
  dotClassName = '',
  count = 3,
}) => {
  // Create an array based on the count to map over
  const dots = Array.from({ length: count }).map((_, i) => i);

  return (
    <View
      className={cn(
        `flex-row flex-1 h-full w-full items-center justify-center space-x-2`,
        className,
      )}
      accessibilityRole="progressbar"
    >
      {dots.map((index) => (
        <Dot
          key={index}
          index={index}
          size={size}
          color={color}
          duration={duration}
          baseDotClassName={dotClassName}
        />
      ))}
    </View>
  );
};

// 2. The Individual Animated Dot
const Dot = ({
  index,
  size,
  color,
  duration,
  baseDotClassName,
}: {
  index: number;
  size: number;
  color: string;
  duration: number;
  baseDotClassName: string;
}) => {
  return (
    <MotiView
      from={{
        opacity: 0.5,
        scale: 0.8,
        translateY: 0,
      }}
      animate={{
        opacity: 1,
        scale: 1.2,
        translateY: -5, // Slight jump effect
      }}
      transition={{
        type: 'timing',
        duration: duration,
        loop: true,
        // 3. Stagger the animation based on index
        delay: index * (duration / 3),
        repeatReverse: true,
      }}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
      }}
      // Combine default styles with custom NativeWind classes
      className={cn(`rounded-full shadow-sm`, baseDotClassName)}
    />
  );
};

export { LoadingScreen };
