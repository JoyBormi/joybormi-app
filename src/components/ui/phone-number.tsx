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

const COUNTRY_PREFIX = '+998';

const PhoneInput = React.forwardRef<
  React.ComponentRef<typeof TextInput>,
  PhoneInputProps
>(
  (
    { className, value = '', onChangeText, defaultCountry = 'UZ', ...props },
    ref,
  ) => {
    const formatter = React.useRef(new AsYouType(defaultCountry));

    const handleTextChange = (text: string) => {
      // Strip everything except digits
      const digits = text.replace(/\D/g, '');

      // Ensure country prefix ONCE
      const e164 = digits.startsWith('998')
        ? `+${digits}`
        : `${COUNTRY_PREFIX}${digits}`;

      formatter.current.reset();
      const formatted = formatter.current.input(e164);

      // Prevent deleting country code
      if (!formatted.startsWith(COUNTRY_PREFIX)) {
        onChangeText?.(COUNTRY_PREFIX);
        return;
      }

      onChangeText?.(formatted);
    };

    return (
      <Input
        ref={ref}
        keyboardType="phone-pad" // allows +
        className={className}
        value={value}
        onChangeText={handleTextChange}
        placeholder="99 123 45 67"
        {...props}
      />
    );
  },
);

PhoneInput.displayName = 'PhoneInput';

export { PhoneInput };
