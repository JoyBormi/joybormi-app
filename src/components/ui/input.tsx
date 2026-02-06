import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';

import { cn } from '@/lib/utils';

import { TFieldValue } from '../shared/form-field';

const Input = React.forwardRef<
  React.ComponentRef<typeof TextInput>,
  Omit<TextInputProps, 'value'> & {
    value: TFieldValue;
  }
>(({ className, value, ...props }, ref) => {
  return (
    <TextInput
      ref={ref}
      value={value ? value?.toString() : ''}
      className={cn(
        'h-14 bg-muted/50  rounded-md border border-input placeholder:text-muted-foreground focus:border-border focus:bg-muted/70 px-3 font-body native:leading-[1.25] text-foreground',
        props.editable === false && 'opacity-50',
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
