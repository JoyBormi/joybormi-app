import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { TextClassContext } from '@/components/ui/text';
import { Feedback } from '@/lib/haptics';
import { cn } from '@/lib/utils';

const buttonVariants = cva('flex items-center justify-center rounded-xl', {
  variants: {
    variant: {
      default: 'bg-primary active:opacity-90 shadow-sm',
      destructive: 'bg-destructive active:opacity-90 shadow-sm',
      outline: 'border-2 border-border bg-background active:bg-accent/20',
      secondary: 'bg-secondary active:opacity-85 shadow-sm',
      ghost: 'active:bg-accent/25',
      link: 'active:opacity-70',
    },
    size: {
      default: 'h-12 px-6',
      sm: 'h-10 px-4 rounded-md',
      lg: 'h-14 px-8',
      xl: 'h-16 px-10',
      icon: 'h-12 w-12',
      iconSm: 'h-10 w-10',
      iconLg: 'h-14 w-14',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

const buttonTextVariants = cva('font-montserrat-medium text-foreground', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      destructive: 'text-destructive-foreground',
      outline: 'text-foreground',
      secondary: 'text-secondary-foreground',
      ghost: 'text-foreground',
      link: 'text-primary underline',
    },
    size: {
      sm: 'font-caption',
      default: 'font-body',
      lg: 'font-title',
      xl: 'font-title',
      icon: '',
      iconSm: '',
      iconLg: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof buttonVariants> & {
    haptic?: boolean;
    loading?: boolean;
  };

const Button = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  ButtonProps
>(
  (
    {
      className,
      variant,
      size,
      onPress,
      disabled,
      haptic = false,
      loading = false,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
        <Pressable
          className={cn(
            isDisabled && 'opacity-40',
            buttonVariants({ variant, size, className }),
          )}
          ref={ref}
          role="button"
          disabled={isDisabled}
          onPress={(e) => {
            if (!isDisabled) {
              haptic && Feedback.light();
              onPress?.(e);
            }
          }}
          {...props}
        >
          {(state) => (
            <View className="flex-row items-center gap-2">
              {loading && <ActivityIndicator size="small" />}
              {typeof children === 'function' ? children(state) : children}
            </View>
          )}
        </Pressable>
      </TextClassContext.Provider>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
