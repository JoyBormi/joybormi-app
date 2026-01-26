import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';

import { Input } from './input';

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
      <Input
        ref={ref}
        keyboardType="decimal-pad"
        className={className}
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
