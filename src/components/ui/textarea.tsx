import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';

import { cn } from '@/lib/utils';

import { TFieldValue } from '../shared/form-field';

const Textarea = React.forwardRef<
  React.ComponentRef<typeof TextInput>,
  Omit<TextInputProps, 'value'> & {
    value?: TFieldValue;
  }
>(
  (
    {
      className,
      multiline = true,
      scrollEnabled = true,
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
          'h-fit min-h-[100px] rounded-md border border-input focus:border-border bg-muted/50 focus:bg-muted/70 px-3  font-body leading-[1.25] text-foreground placeholder:text-muted-foreground',
          props.editable === false && 'opacity-50',
          className,
        )}
        placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
        multiline={multiline}
        scrollEnabled={scrollEnabled}
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
