import * as React from 'react';
import { TextInput, View } from 'react-native';

import { cn } from '@/lib/utils';

interface OtpInputProps {
  length?: number;
  value?: string;
  onChangeText?: (value: string) => void;
  onComplete?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

/**
 * OTP Input Component
 * Renders multiple input boxes for OTP/verification code entry
 * Auto-focuses next input on digit entry, supports backspace navigation
 *
 * @example
 * <OtpInput
 *   length={6}
 *   value={code}
 *   onChangeText={setCode}
 *   onComplete={(code) => console.log('Complete:', code)}
 * />
 */
const OtpInput = React.forwardRef<View, OtpInputProps>(
  (
    {
      length = 6,
      value = '',
      onChangeText,
      onComplete,
      className,
      disabled = false,
      autoFocus = true,
    },
    ref,
  ) => {
    const inputRefs = React.useRef<(TextInput | null)[]>([]);
    const [otpValues, setOtpValues] = React.useState<string[]>(
      Array(length).fill(''),
    );

    // Sync external value with internal state
    React.useEffect(() => {
      const digits = value.split('').slice(0, length);
      const newValues = [...Array(length).fill(''), ...digits].slice(0, length);
      setOtpValues(newValues);
    }, [value, length]);

    const handleChangeText = (text: string, index: number) => {
      // Only allow single digit
      const digit = text.slice(-1).replace(/[^0-9]/g, '');

      const newValues = [...otpValues];
      newValues[index] = digit;
      setOtpValues(newValues);

      // Notify parent
      const fullValue = newValues.join('');
      onChangeText?.(fullValue);

      // Auto-focus next input
      if (digit && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Call onComplete when all digits are filled
      if (digit && index === length - 1 && newValues.every((v) => v !== '')) {
        onComplete?.(fullValue);
      }
    };

    const handleKeyPress = (
      e: { nativeEvent: { key: string } },
      index: number,
    ) => {
      // Handle backspace - move to previous input if current is empty
      if (e.nativeEvent.key === 'Backspace' && !otpValues[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    };

    return (
      <View ref={ref} className={cn('flex-row gap-2', className)}>
        {Array.from({ length }).map((_, index) => (
          <TextInput
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            value={otpValues[index]}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            autoFocus={autoFocus && index === 0}
            editable={!disabled}
            className={cn(
              'h-14 w-14 rounded-md border-2 border-border bg-background text-center typo-subtitle text-foreground',
              'focus:border-primary focus:ring-2 focus:ring-primary/20',
              disabled && 'opacity-50',
              otpValues[index] && 'border-primary',
            )}
          />
        ))}
      </View>
    );
  },
);

OtpInput.displayName = 'OtpInput';

export { OtpInput };
