import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { View } from 'react-native';

const minimalCardVariants = cva('', {
  variants: {
    size: {
      default: 'minimal-card',
      lg: 'minimal-card-lg',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface MinimalCardProps
  extends
    React.ComponentPropsWithoutRef<typeof View>,
    VariantProps<typeof minimalCardVariants> {}

const MinimalCard = React.forwardRef<
  React.ComponentRef<typeof View>,
  MinimalCardProps
>(({ className, size, ...props }, ref) => {
  return (
    <View
      ref={ref}
      className={cn(minimalCardVariants({ size, className }))}
      {...props}
    />
  );
});

MinimalCard.displayName = 'MinimalCard';

export { MinimalCard, minimalCardVariants };
