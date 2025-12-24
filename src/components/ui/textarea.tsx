import { cn } from '@/lib/utils';
import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';

const Textarea = React.forwardRef<
  React.ComponentRef<typeof TextInput>,
  TextInputProps
>(
  (
    {
      className,
      multiline = true,
      numberOfLines = 4,
      placeholderClassName,
      ...props
    },
    ref,
  ) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          'web:flex h-10 native:h-12 min-h-[100px] web:w-full rounded-md border border-input focus:border-border bg-background px-3 web:py-2 lg:text-body native:text-caption native:leading-[1.25] text-foreground placeholder:font-regular placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
          props.editable === false && 'opacity-50 web:cursor-not-allowed',
          className,
        )}
        placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
