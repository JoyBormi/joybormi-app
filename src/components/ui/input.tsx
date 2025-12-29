import { cn } from '@/lib/utils';
import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';

const Input = React.forwardRef<
  React.ComponentRef<typeof TextInput>,
  Omit<TextInputProps, 'value'> & {
    value: string | string[] | undefined;
  }
>(({ className, value, ...props }, ref) => {
  return (
    <TextInput
      ref={ref}
      value={value ? value?.toString() : ''}
      className={cn(
        'web:flex h-10 native:h-12 bg-muted/20 web:w-full rounded-md border border-input focus:border-border focus:bg-muted/30 px-3 web:py-2 lg:text-body native:text-caption native:leading-[1.25] text-foreground placeholder:font-regular placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
        props.editable === false && 'opacity-50 web:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
