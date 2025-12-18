import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Pressable } from 'react-native';

// TODO: update the styles background, text sizes, and badge size to fit only

const BadgeVariants = cva(
  'group flex max-w-24 items-center justify-center rounded-xl web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        success: 'bg-success',
        destructive: 'bg-destructive',
        info: 'bg-warning',
      },
      size: {
        sm: 'px-1',
        md: 'py-1 px-1',
        lg: 'py-1 px-2',
      },
      role: {
        button: 'button',
        note: 'note',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      role: 'note',
    },
  },
);

const BadgeTextVariants = cva('w-auto', {
  variants: {
    variant: {
      default: 'text-background',
      success: 'text-secondary-foreground',
      destructive: 'text-background',
      info: 'text-background',
    },
    size: {
      sm: '',
      md: '',
      lg: 'native:text-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

type BadgeProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof BadgeVariants>;

const Badge = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  BadgeProps
>(({ className, variant, size, role, ...props }, ref) => {
  return (
    <TextClassContext.Provider
      value={BadgeTextVariants({
        variant,
        size,
        className: 'web:pointer-events-none',
      })}
    >
      <Pressable
        className={cn(
          props.disabled && 'opacity-50 web:pointer-events-none',
          BadgeVariants({ variant, size, className }),
        )}
        ref={ref}
        role={role}
        {...props}
      />
    </TextClassContext.Provider>
  );
});
Badge.displayName = 'Badge';

export { Badge, BadgeTextVariants, BadgeVariants };
export type { BadgeProps };
