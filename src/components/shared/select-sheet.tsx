import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { forwardRef } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CustomBottomSheet from '@/components/shared/bottom-sheet';
import { Text } from '@/components/ui';
import Icons from '@/lib/icons';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectSheetProps {
  options: SelectOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  title?: string;
  multiple?: boolean;
}

/**
 * Select Bottom Sheet Component
 * Displays a list of options in a bottom sheet
 */
export const SelectSheet = forwardRef<BottomSheetModal, SelectSheetProps>(
  (
    { options, value, onChange, title = 'Select Option', multiple = false },
    ref,
  ) => {
    const insets = useSafeAreaInsets();

    const isSelected = (optionValue: string) => {
      if (Array.isArray(value)) {
        return value.includes(optionValue);
      }
      return value === optionValue;
    };

    const handleSelect = (optionValue: string) => {
      if (multiple) {
        const currentValues = Array.isArray(value) ? value : [];
        const newValues = currentValues.includes(optionValue)
          ? currentValues.filter((v) => v !== optionValue)
          : [...currentValues, optionValue];
        onChange(newValues);
      } else {
        onChange(optionValue);
        if (ref && 'current' in ref) {
          ref.current?.dismiss();
        }
      }
    };

    return (
      <CustomBottomSheet
        ref={ref}
        index={0}
        snapPoints={['60%']}
        scrollEnabled
        scrollConfig={{
          contentContainerStyle: {
            paddingBottom: insets.bottom + 20,
          },
        }}
      >
        <View className="mb-6">
          <Text className="font-heading text-xl text-foreground">{title}</Text>
          {multiple && (
            <Text className="font-body text-muted-foreground mt-1">
              Select multiple options
            </Text>
          )}
        </View>

        <View className="gap-2">
          {options.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => handleSelect(option.value)}
              className="flex-row items-center justify-between p-4 rounded-xl bg-muted/20 active:bg-muted/40"
            >
              <Text className="font-subtitle text-foreground flex-1">
                {option.label}
              </Text>
              {isSelected(option.value) && (
                <Icons.Check
                  size={20}
                  className="text-primary"
                  strokeWidth={3}
                />
              )}
            </Pressable>
          ))}
        </View>

        {multiple && (
          <View className="mt-6">
            <Pressable
              onPress={() => {
                if (ref && 'current' in ref) {
                  ref.current?.dismiss();
                }
              }}
              className="p-4 rounded-xl bg-primary"
            >
              <Text className="font-subtitle text-primary-foreground text-center">
                Done
              </Text>
            </Pressable>
          </View>
        )}
      </CustomBottomSheet>
    );
  },
);

SelectSheet.displayName = 'SelectSheet';
