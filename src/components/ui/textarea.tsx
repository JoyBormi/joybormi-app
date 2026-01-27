import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';

import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<
  React.ComponentRef<typeof TextInput>,
  Omit<TextInputProps, 'value'> & {
    value: string | string[] | undefined;
  }
>(
  (
    {
      className,
      multiline = true,
      numberOfLines = 6,
      placeholderClassName,
      value,
      ...props
    },
    ref,
  ) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          'h-fit min-h-[100px] rounded-md border border-input focus:border-border bg-muted/50 focus:bg-muted/70 px-3  font-body leading-[1.25] text-foreground placeholder:text-muted-foreground w',
          props.editable === false && 'opacity-50',
          className,
        )}
        placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        value={value ? value?.toString() : ''}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
