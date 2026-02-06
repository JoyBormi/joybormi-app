import {
  AsYouType,
  CountryCode,
  getCountryCallingCode,
} from 'libphonenumber-js';
import * as React from 'react';
import { TextInput, TextInputProps } from 'react-native';

import { TFieldValue } from '../shared/form-field';

import { Input } from './input';

interface PhoneInputProps extends Omit<
  TextInputProps,
  'keyboardType' | 'value' | 'onChangeText'
> {
  value?: TFieldValue;
  onChangeText?: (value: string) => void;
  defaultCountry?: CountryCode;
}

function getPrefix(country: CountryCode) {
  return `+${getCountryCallingCode(country)}`;
}

function normalize(input: string, country: CountryCode) {
  const digits = input.replace(/\D/g, '');
  const code = getCountryCallingCode(country);

  if (!digits) return `+${code}`;
  if (digits.startsWith(code)) return `+${digits}`;
  return `+${code}${digits}`;
}

const PhoneInput = React.forwardRef<
  React.ComponentRef<typeof TextInput>,
  PhoneInputProps
>(
  (
    { className, value, onChangeText, defaultCountry = 'UZ', ...props },
    ref,
  ) => {
    const prefix = React.useMemo(
      () => getPrefix(defaultCountry),
      [defaultCountry],
    );

    const [text, setText] = React.useState(prefix);

    // Sync backend → UI (formatted)
    React.useEffect(() => {
      if (!value) {
        setText(prefix);
        return;
      }

      const formatter = new AsYouType(defaultCountry);
      setText(formatter.input(normalize(String(value), defaultCountry)));
    }, [value, defaultCountry, prefix]);

    const handleChange = React.useCallback(
      (input: string) => {
        if (!input.startsWith(prefix)) {
          setText(prefix);
          return;
        }

        const formatter = new AsYouType(defaultCountry);
        const formatted = formatter.input(input);

        setText(formatted);
        onChangeText?.(normalize(formatted, defaultCountry));
      },
      [defaultCountry, prefix, onChangeText],
    );

    return (
      <Input
        ref={ref}
        keyboardType="phone-pad"
        value={text}
        onChangeText={handleChange}
        placeholder="99 123 45 67"
        className={className}
        {...props}
      />
    );
  },
);

PhoneInput.displayName = 'PhoneInput';

export { PhoneInput };
