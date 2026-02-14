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

import { TFieldValue } from '../shared/form-field';

import { PressableBounce } from './pressable-bounce';
import { Text } from './text';

interface Option {
  label: string;
  value: TFieldValue;
}

type SelectProps = {
  options: Option[];
  placeholder?: string;
  title?: string;
  multi?: boolean;
  value: TFieldValue;
  children?: React.ReactNode;
  onBlur?: () => void;
  onChangeText: (value: TFieldValue) => void;
};

export function Select({
  options,
  value,
  onChangeText,
  placeholder = 'Select...',
  multi = false,
  children,
  title,
}: SelectProps) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const displayLabel = useMemo(() => {
    if (multi && Array.isArray(value)) {
      return value.length > 0 ? `${value.length} selected` : placeholder;
    }
    const selected = options.find((opt) => opt.value === value);
    return selected ? selected.label : placeholder;
  }, [value, options, multi, placeholder]);

  const toggleOption = (itemValue: TFieldValue) => {
    Feedback.selection();
    if (multi) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValue = currentValues.includes(itemValue as string)
        ? currentValues.filter((v) => v !== itemValue)
        : [...currentValues, itemValue];
      onChangeText?.(newValue as string[]);
    } else {
      onChangeText?.(itemValue as string);
      setShowModal(false);
    }
  };

  return (
    <Fragment>
      <Pressable onPress={() => setShowModal(true)}>
        {children ?? (
          <View pointerEvents='none' className="h-14 bg-muted/50 rounded-md border border-input focus:border-border focus:bg-muted/70 px-3 flex-row items-center w-full justify-between">
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
          </View>
        )}
      </Pressable>

      <Modal
        transparent
        visible={showModal}
        animationType="none"
        statusBarTranslucent
      >
        <View className="flex-1 justify-center items-center px-6">
          {/* Backdrop */}
          <Animated.View
            entering={FadeIn.duration(120)}
            exiting={FadeOut.duration(150)}
            className="absolute inset-0 bg-black/20"
          >
            <Pressable className="flex-1" onPress={() => setShowModal(false)} />
          </Animated.View>

          {/* Modal Container */}
          <Animated.View
            entering={ZoomIn.duration(250)}
            exiting={ZoomOut.duration(200)}
            className="w-full max-w-sm max-h-[60%] h-[280px] overflow-hidden rounded-xl border border-border shadow-2xl bg-card"
          >
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-3 border-b border-border">
              <Text className="font-subtitle text-foreground">
                {title || placeholder}
              </Text>
              <Pressable
                onPress={() => setShowModal(false)}
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
                keyExtractor={(item) => item.value?.toString() || ''}
                showsVerticalScrollIndicator={false}
                extraData={value}
                renderItem={({ item }) => {
                  const isSelected = multi
                    ? Array.isArray(value) &&
                      value.includes(item.value as string)
                    : value === item.value;

                  return (
                    <PressableBounce
                      onPress={() => toggleOption(item.value)}
                      className={cn(
                        'flex-1 p-4 mb-2 rounded-2xl border',
                        isSelected
                          ? 'bg-primary/80 border-primary/20'
                          : 'bg-secondary border-border active:bg-secondary/90',
                      )}
                    >
                      <Text
                        className={cn(
                          'capitalize w-full font-body',
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
                  onPress={() => setShowModal(false)}
                  className="w-full bg-primary py-4 rounded-2xl items-center active:opacity-90"
                >
                  <Text className="text-primary-foreground font-semibold">
                    {t('common.buttons.submit')}
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
