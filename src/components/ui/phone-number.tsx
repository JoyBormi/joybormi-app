import { AsYouType, CountryCode } from 'libphonenumber-js';
import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';

import { Input } from './input';

interface PhoneInputProps extends Omit<
  TextInputProps,
  'keyboardType' | 'value' | 'onChangeText'
> {
  value?: string;
  onChangeText?: (value: string) => void;
  defaultCountry?: CountryCode;
}

const PhoneInput = React.forwardRef<
  React.ComponentRef<typeof TextInput>,
  PhoneInputProps
>(
  (
    { className, value = '', onChangeText, defaultCountry = 'US', ...props },
    ref,
  ) => {
    const isTherePlus = value.startsWith('+');

    const formatter = React.useRef(new AsYouType(defaultCountry));

    const handleTextChange = (text: string) => {
      formatter.current.reset();
      let formatted = formatter.current.input(text);
      if (!isTherePlus) {
        formatted = `+998 ${formatted}`;
      }

      if (onChangeText) {
        onChangeText(formatted);
      }
    };

    return (
      <Input
        ref={ref}
        keyboardType="number-pad"
        className={className}
        value={value}
        onChangeText={handleTextChange}
        placeholder="+(99) 123 45 67"
        {...props}
      />
    );
  },
);

PhoneInput.displayName = 'PhoneInput';

export { PhoneInput };
