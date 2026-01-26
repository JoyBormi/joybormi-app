import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';

import { cn } from '@/lib/utils';

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
        'h-14 bg-muted/30  rounded-md border border-input focus:border-border focus:bg-muted/50 px-3 font-body native:leading-[1.25] text-foreground placeholder:font-regular placeholder:text-muted-foreground',
        props.editable === false && 'opacity-50 web:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
