import { cn } from '@/lib/utils';
import { AsYouType, CountryCode } from 'libphonenumber-js';
import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';

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
        formatted = `+${formatted}`;
      }

      if (onChangeText) {
        onChangeText(formatted);
      }
    };

    return (
      <TextInput
        ref={ref}
        keyboardType="number-pad"
        className={cn(
          'web:flex h-10 native:h-12 web:w-full rounded-md border border-input focus:border-border focus:bg-muted/30 bg-muted/20 px-3 web:py-2 lg:text-body native:text-caption native:leading-[1.25] text-foreground placeholder:font-regular placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
          props.editable === false && 'opacity-50 web:cursor-not-allowed',
          className,
        )}
        value={value}
        onChangeText={handleTextChange}
        placeholder="+1 (555) 000-0000"
        {...props}
      />
    );
  },
);

PhoneInput.displayName = 'PhoneInput';

export { PhoneInput };
