import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { Pressable, View } from 'react-native';

export interface MinimalCheckboxProps {
  checked: boolean;
  onPress: () => void;
  label: string;
  className?: string;
}

const MinimalCheckbox = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  MinimalCheckboxProps
>(({ checked, onPress, label, className }, ref) => {
  return (
    <Pressable
      ref={ref}
      onPress={onPress}
      className={cn(
        checked ? 'minimal-checkbox-active' : 'minimal-checkbox',
        className,
      )}
    >
      <Text
        className={cn(
          'text-base font-medium',
          checked ? 'text-primary' : 'text-gray-700',
        )}
      >
        {label}
      </Text>
      <View
        className={cn(
          checked
            ? 'minimal-checkbox-indicator-active'
            : 'minimal-checkbox-indicator',
        )}
      >
        {checked && <Text className="text-white font-bold text-sm">✓</Text>}
      </View>
    </Pressable>
  );
});

MinimalCheckbox.displayName = 'MinimalCheckbox';

export { MinimalCheckbox };
