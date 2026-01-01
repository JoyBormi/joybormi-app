import React from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';

import { Text } from '@/components/ui';
import { useColorScheme } from '@/hooks/common';
import { TIMELINE_MARK_COLORS, TimelineColorName } from '@/styles/calendar';

interface ColorPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectColor: (color: TimelineColorName) => void;
  currentColor?: TimelineColorName;
}

export const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  visible,
  onClose,
  onSelectColor,
  currentColor,
}) => {
  const { colors, isDarkColorScheme } = useColorScheme();
  const colorTheme = isDarkColorScheme ? 'dark' : 'light';
  const colorOptions = TIMELINE_MARK_COLORS[colorTheme];

  const handleColorSelect = (colorName: TimelineColorName) => {
    onSelectColor(colorName);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 justify-center items-center bg-black/50"
        onPress={onClose}
      >
        <Pressable
          className="w-[85%] max-w-md rounded-2xl p-6"
          style={{ backgroundColor: colors.card }}
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-xl font-bold mb-4">Select Event Color</Text>

          <ScrollView className="max-h-96">
            <View className="flex-row flex-wrap gap-3">
              {(Object.keys(colorOptions) as TimelineColorName[]).map(
                (colorName) => {
                  const colorValue = colorOptions[colorName];
                  const isSelected = currentColor === colorName;

                  return (
                    <Pressable
                      key={colorName}
                      onPress={() => handleColorSelect(colorName)}
                      className="items-center"
                      style={{ width: '28%' }}
                    >
                      <View
                        className="w-16 h-16 rounded-2xl mb-2 border-2"
                        style={{
                          backgroundColor: colorValue,
                          borderColor: isSelected
                            ? colors.primary
                            : colors.border,
                          borderWidth: isSelected ? 3 : 1,
                        }}
                      />
                      <Text
                        className="text-xs capitalize text-center"
                        style={{
                          color: isSelected ? colors.primary : colors.text,
                          fontWeight: isSelected ? '600' : '400',
                        }}
                      >
                        {colorName}
                      </Text>
                    </Pressable>
                  );
                },
              )}
            </View>
          </ScrollView>

          <Pressable
            className="mt-6 py-3 rounded-xl items-center"
            style={{ backgroundColor: colors.primary }}
            onPress={onClose}
          >
            <Text
              className="font-semibold"
              style={{ color: colors.background }}
            >
              Close
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
