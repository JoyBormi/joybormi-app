import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { cn } from '@/lib/utils';

interface LoadingProps {
  /** Whether the loader is visible. Defaults to true. */
  loading?: boolean;
  /** Custom color string (hex/rgb). Defaults to Tailwind 'text-primary'. */
  color?: string;
  /** Container classes. */
  className?: string;

  /** ActivityIndicator variant. */
  variant?: 'screen' | 'modal';

  /** ActivityIndicator size. */
  size?: 'small' | 'large';
}

export function Loading({
  loading = true,
  size = 'large',
  color,
  variant = 'screen',
  className,
}: LoadingProps) {
  if (!loading) return null;

  return (
    <View
      className={cn(
        variant === 'screen'
          ? 'flex-1 items-center justify-center bg-background'
          : 'items-center justify-center bg-muted/50',
        className,
      )}
    >
      <View
        className={cn(
          variant === 'screen'
            ? 'flex-row items-center justify-center p-6 bg-muted/50 rounded-lg'
            : '',
        )}
        accessibilityRole="progressbar"
      >
        <ActivityIndicator color={color} size={size} />
      </View>
    </View>
  );
}
