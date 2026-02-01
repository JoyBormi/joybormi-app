/* eslint-disable @typescript-eslint/no-explicit-any */
import { FlashList } from '@shopify/flash-list';
import { ChevronDown, X } from 'lucide-react-native';
import React, { Fragment, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';

import { Feedback } from '@/lib/haptics';
import { cn } from '@/lib/utils';

import { PressableBounce } from './pressable-bounce';
import { Text } from './text';

export type SelectValue = string | number;

interface Option {
  label: string;
  value: SelectValue;
}

type SelectProps = {
  options: Option[];
  placeholder?: string;
  title?: string;
} & (
  | {
      multi: true;
      value: SelectValue[];
      onChangeText: (value: SelectValue[]) => void;
    }
  | {
      multi?: false;
      value: SelectValue | undefined;
      onChangeText: (value: SelectValue) => void;
    }
);

export function Select({
  options,
  value,
  onChangeText,
  placeholder = 'Select...',
  multi = false,
  title,
}: SelectProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const displayLabel = useMemo(() => {
    if (multi && Array.isArray(value)) {
      return value.length > 0 ? `${value.length} selected` : placeholder;
    }
    const selected = options.find((opt) => opt.value === value);
    return selected ? selected.label : placeholder;
  }, [value, options, multi, placeholder]);

  const toggleOption = (itemValue: SelectValue) => {
    Feedback.selection();
    if (multi) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValue = currentValues.includes(itemValue)
        ? currentValues.filter((v) => v !== itemValue)
        : [...currentValues, itemValue];
      onChangeText?.(newValue as any);
    } else {
      onChangeText?.(itemValue as any);
      setVisible(false);
    }
  };

  return (
    <Fragment>
      <Pressable
        onPress={() => setVisible(true)}
        className="h-14 bg-muted/50 rounded-md border border-input focus:border-border focus:bg-muted/70 px-3 flex-row items-center w-full justify-between"
      >
        <Text
          className={cn(
            'font-body native:leading-[1.25]',
            value !== undefined && value !== ''
              ? 'text-foreground'
              : 'text-muted-foreground',
          )}
        >
          {displayLabel}
        </Text>
        <ChevronDown size={18} className="text-muted-foreground shrink-0" />
      </Pressable>

      <Modal
        transparent
        visible={visible}
        animationType="none"
        statusBarTranslucent
      >
        <View className="flex-1 justify-center items-center px-6">
          {/* Backdrop */}
          <Animated.View
            entering={FadeIn.duration(120)}
            exiting={FadeOut.duration(150)}
            className="absolute inset-0 bg-foreground/20"
          >
            <Pressable className="flex-1" onPress={() => setVisible(false)} />
          </Animated.View>

          {/* Modal Container */}
          <Animated.View
            entering={ZoomIn.duration(250)}
            exiting={ZoomOut.duration(200)}
            className="w-full max-w-sm max-h-[60%] min-h-[400px] overflow-hidden rounded-xl border border-border shadow-2xl bg-card"
          >
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-5">
              <Text className="text-lg font-semibold text-foreground">
                {title || placeholder}
              </Text>
              <Pressable
                onPress={() => setVisible(false)}
                className="p-2 rounded-full bg-secondary active:bg-secondary/80"
              >
                <X size={16} className="text-foreground" />
              </Pressable>
            </View>

            {/* List: Uses flex-1 to ensure it fills available space */}
            <View className="flex-1">
              <FlashList
                data={options}
                contentContainerStyle={{ padding: 16 }}
                keyExtractor={(item) => item.value.toString()}
                showsVerticalScrollIndicator={false}
                extraData={value}
                renderItem={({ item }) => {
                  const isSelected = multi
                    ? Array.isArray(value) && value.includes(item.value)
                    : value === item.value;

                  return (
                    <PressableBounce
                      onPress={() => toggleOption(item.value)}
                      className={cn(
                        'flex-1 p-4 mb-2 rounded-2xl border',
                        isSelected
                          ? 'bg-primary/40 border-primary/20'
                          : 'bg-secondary/40 border-transparent active:bg-secondary/40',
                      )}
                    >
                      <Text
                        className={cn(
                          'text-base capitalize w-full',
                          isSelected
                            ? 'font-semibold text-primary-foreground'
                            : 'text-foreground',
                        )}
                      >
                        {item.label}
                      </Text>
                    </PressableBounce>
                  );
                }}
              />
            </View>

            {multi && (
              <View className="p-4 pt-2 absolute bottom-2 left-0 right-0 w-fit">
                <Pressable
                  onPress={() => setVisible(false)}
                  className="w-full bg-primary py-4 rounded-2xl items-center active:opacity-90"
                >
                  <Text className="text-primary-foreground font-semibold">
                    {t('common.buttons.done')}
                  </Text>
                </Pressable>
              </View>
            )}
          </Animated.View>
        </View>
      </Modal>
    </Fragment>
  );
}
