import { BlurView } from 'expo-blur';
import React from 'react';
import { Modal, Platform, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';

import Icons from '@/components/icons';
import { Button, Text } from '@/components/ui';
import { useAlertStore } from '@/stores/use-alert-store';

export function GlobalAlert() {
  const { visible, options, hideAlert } = useAlertStore();

  if (!visible || !options) return null;

  const handleConfirm = async () => {
    if (!options.onConfirm) {
      hideAlert();
      return;
    }

    const result = options.onConfirm();

    if (result instanceof Promise) {
      await result;
    }

    hideAlert();
  };

  const handleCancel = () => {
    options.onCancel?.();
    hideAlert();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
    >
      <View className="flex-1 justify-center items-center px-10">
        {/* Simple fade for the backdrop */}
        <Animated.View
          entering={FadeIn.duration(120)}
          exiting={FadeOut.duration(150)}
          className="absolute inset-0 bg-black/20"
        />

        {/* Modal content with linear-style Zoom for a "system" feel */}
        <Animated.View
          entering={ZoomIn.duration(250)}
          exiting={ZoomOut.duration(200)}
          className="w-full z-50 max-w-sm overflow-hidden rounded-xl border border-foreground/20 shadow-2xl shadow-primary/10 bg-card/30"
        >
          <BlurView
            intensity={Platform.OS === 'ios' ? 55 : 80}
            tint="light"
            className="px-4 py-8"
          >
            <View className="items-center">
              {/* Creative Icon Housing */}
              <View className="p-4 bg-primary/15 rounded-full items-center justify-center mb-5">
                {options.icon || (
                  <Icons.AlertCircle size={28} className="text-primary" />
                )}
              </View>

              <Text className="font-title text-foreground text-center mb-2 tracking-tight">
                {options.title}
              </Text>

              {options.subtitle && (
                <Text className="font-body text-muted-foreground text-center leading-5 px-1 mb-8">
                  {options.subtitle}
                </Text>
              )}
            </View>

            {/* Actions: Clean hierarchy */}
            <View className="flex-row gap-3">
              {options.cancelLabel !== null && (
                <Button onPress={handleCancel} className="flex-1" size="lg">
                  <Text>{options.cancelLabel || 'Cancel'}</Text>
                </Button>
              )}

              <Button onPress={handleConfirm} className="flex-1" size="lg">
                <Text className="font-semibold text-white">
                  {options.confirmLabel || 'Confirm'}
                </Text>
              </Button>
            </View>
          </BlurView>
        </Animated.View>
      </View>
    </Modal>
  );
}
