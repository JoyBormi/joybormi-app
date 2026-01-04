import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';

import { cn } from '@/lib/utils';

interface NumberInputProps extends Omit<TextInputProps, 'keyboardType'> {
  onNumberChange?: (value: string) => void;
  maxDecimals?: number;
  allowNegative?: boolean;
}

const NumberInput = React.forwardRef<
  React.ComponentRef<typeof TextInput>,
  NumberInputProps
>(
  (
    {
      className,
      onNumberChange,
      onChangeText,
      value,
      maxDecimals = 2,
      allowNegative = false,
      ...props
    },
    ref,
  ) => {
    const formatNumber = (text: string): string => {
      let cleaned = text;

      if (!allowNegative) {
        cleaned = cleaned.replace(/-/g, '');
      } else {
        cleaned = cleaned.replace(/(?!^)-/g, '');
      }

      cleaned = cleaned.replace(/[^\d.-]/g, '');

      const parts = cleaned.split('.');
      if (parts.length > 2) {
        cleaned = parts[0] + '.' + parts.slice(1).join('');
      }

      if (parts.length === 2 && parts[1].length > maxDecimals) {
        cleaned = parts[0] + '.' + parts[1].slice(0, maxDecimals);
      }

      return cleaned;
    };

    const handleTextChange = (text: string) => {
      const formatted = formatNumber(text);

      if (onNumberChange) {
        onNumberChange(formatted);
      }
      if (onChangeText) {
        onChangeText(formatted);
      }
    };

    return (
      <TextInput
        ref={ref}
        keyboardType="decimal-pad"
        className={cn(
          'web:flex h-10 native:h-12 web:w-full rounded-md border border-input focus:border-border bg-muted/20 focus:bg-muted/30 px-3 web:py-2 lg:text-body native:text-caption native:leading-[1.25] text-foreground placeholder:font-regular placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
          props.editable === false && 'opacity-50 web:cursor-not-allowed',
          className,
        )}
        value={value}
        onChangeText={handleTextChange}
        placeholder="0.00"
        {...props}
      />
    );
  },
);

NumberInput.displayName = 'NumberInput';

export { NumberInput };
