import { TextClassContext } from '@/components/ui/text';
import { Feedback } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Pressable } from 'react-native';

const buttonVariants = cva(
  'group flex items-center justify-center rounded-md web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary web:hover:bg-primary/90 active:bg-primary/80',
        destructive:
          'bg-destructive web:hover:bg-destructive/90 active:bg-destructive/80',
        outline:
          'border border-border bg-background web:hover:bg-accent/40 web:hover:text-accent-foreground active:bg-accent/30',
        secondary:
          'bg-secondary web:hover:bg-secondary/80 active:bg-secondary/70',
        ghost:
          'web:hover:bg-accent/40 web:hover:text-accent-foreground active:bg-accent/30',
        link: 'web:underline-offset-4 web:hover:underline web:focus:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 native:h-12 native:px-5 native:py-3',
        sm: 'h-8 rounded-md px-3',
        lg: 'h-11 rounded-md px-8 native:h-14',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const buttonTextVariants = cva(
  'web:whitespace-nowrap text-sm native:text-base font-medium text-foreground web:transition-colors',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        destructive: 'text-destructive-foreground',
        outline: 'text-foreground group-hover:text-accent-foreground',
        secondary: 'text-secondary-foreground',
        ghost: 'text-foreground group-hover:text-accent-foreground',
        link: 'text-primary group-hover:underline',
      },
      size: {
        default: '',
        sm: '',
        lg: 'native:text-lg',
        icon: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  ButtonProps
>(({ className, variant, size, onPress, ...props }, ref) => {
  return (
    <TextClassContext.Provider
      value={buttonTextVariants({
        variant,
        size,
        className: 'web:pointer-events-none',
      })}
    >
      <Pressable
        className={cn(
          props.disabled && 'opacity-50 web:pointer-events-none',
          buttonVariants({ variant, size, className }),
        )}
        ref={ref}
        role="button"
        onPress={(e) => {
          Feedback.soft();
          onPress?.(e);
        }}
        {...props}
      />
    </TextClassContext.Provider>
  );
});
Button.displayName = 'Button';

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
