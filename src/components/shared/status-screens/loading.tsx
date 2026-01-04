import { MotiView } from 'moti';
import React from 'react';
import { View } from 'react-native';

import { cn } from '@/lib/utils';

interface LoadingProps {
  /** Whether the loader is visible. Defaults to true. */
  loading?: boolean;
  /** Size of the individual dots. Defaults to 8. */
  size?: number;
  /** Custom color string (hex/rgb). Defaults to Tailwind 'text-primary'. */
  color?: string;
  /** Container classes. */
  className?: string;
  /** Individual dot classes. */
  dotClassName?: string;
}

export function Loading({
  loading = true,
  size = 10,
  color, // specific color override, otherwise uses class styles
  className,
  dotClassName,
}: LoadingProps) {
  if (!loading) return null;

  return (
    <View className="flex-1 bg-background">
      <View
        className={cn(
          'flex-row items-center justify-center gap-1.5',
          className,
        )}
        accessibilityRole="progressbar"
      >
        {[0, 1, 2].map((index) => (
          <Dot
            key={index}
            index={index}
            size={size}
            color={color}
            dotClassName={dotClassName}
          />
        ))}
      </View>
    </View>
  );
}

const Dot = ({
  index,
  size,
  color,
  dotClassName,
}: {
  index: number;
  size: number;
  color?: string;
  dotClassName?: string;
}) => {
  return (
    <MotiView
      from={{ opacity: 0.5, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1.1 }}
      transition={{
        type: 'timing',
        duration: 600,
        loop: true,
        repeatReverse: true,
        delay: index * 150, // Gentle stagger
      }}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
      }}
      className={cn(
        // Default to primary color if no specific color prop is passed
        !color && 'bg-primary',
        dotClassName,
      )}
    />
  );
};
