import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { View } from 'react-native';

const minimalInfoBoxVariants = cva('mt-2', {
  variants: {
    variant: {
      default: 'minimal-info',
      info: 'minimal-info-blue',
      warning: 'minimal-info-yellow',
      success: 'minimal-info-green',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const minimalInfoBoxTextVariants = cva('minimal-body', {
  variants: {
    variant: {
      default: 'text-gray-600',
      info: 'text-blue-700',
      warning: 'text-yellow-700',
      success: 'text-green-700',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface MinimalInfoBoxProps
  extends
    React.ComponentPropsWithoutRef<typeof View>,
    VariantProps<typeof minimalInfoBoxVariants> {
  children: React.ReactNode;
}

const MinimalInfoBox = React.forwardRef<
  React.ComponentRef<typeof View>,
  MinimalInfoBoxProps
>(({ className, variant, children, ...props }, ref) => {
  return (
    <View
      ref={ref}
      className={cn(minimalInfoBoxVariants({ variant, className }))}
      {...props}
    >
      <Text className={minimalInfoBoxTextVariants({ variant })}>
        {children}
      </Text>
    </View>
  );
});

MinimalInfoBox.displayName = 'MinimalInfoBox';

export { MinimalInfoBox, minimalInfoBoxVariants };
