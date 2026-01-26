import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Animated, Easing, Modal, Pressable, Text, View } from 'react-native';

import { Button } from '../ui';

interface BlockModalProps {
  title?: string;
  subtitle?: string;
  confirmText?: string;
  cancelText?: string;
  allowBackdropPress?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface BlockModalRef {
  show: () => void;
  hide: () => void;
}

export const BlockModal = forwardRef<BlockModalRef, BlockModalProps>(
  (
    {
      title = 'Hey, be careful!',
      subtitle = 'Your action may have negative consequences',
      confirmText = 'Got it',
      cancelText = 'Anyways, just close',
      allowBackdropPress = false,
      onConfirm,
      onCancel,
    },
    ref,
  ) => {
    const [visible, setVisible] = useState(false);

    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.96)).current;

    const show = () => {
      setVisible(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 120,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 120,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    };

    const hide = () => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 100,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.96,
          duration: 100,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => setVisible(false));
    };

    useImperativeHandle(ref, () => ({ show, hide }));

    if (!visible) return null;

    return (
      <Modal
        visible={visible}
        transparent
        animationType="none"
        statusBarTranslucent
      >
        <Pressable
          onPress={() => {
            if (allowBackdropPress) {
              hide();
              onCancel?.();
            }
          }}
          className="flex-1 bg-black/30 items-center justify-center px-6"
        >
          <Animated.View
            style={{
              opacity,
              transform: [{ scale }],
            }}
            className="bg-card rounded-3xl w-full max-w-md items-center px-6 pt-12 pb-10"
          >
            <Text className="text-foreground font-heading text-center mb-1">
              {title}
            </Text>

            <Text className="text-muted-foreground text-center mb-4">
              {subtitle}
            </Text>

            <View className="flex-row items-center gap-3 mt-6">
              <Button
                onPress={() => {
                  hide();
                  onCancel?.();
                }}
                variant="ghost"
                className="px-2 flex-[0.3]"
              >
                <Text className="font-body text-destructive">{cancelText}</Text>
              </Button>
              <Pressable
                onPress={() => {
                  hide();
                  onConfirm?.();
                }}
                className="bg-primary flex-[0.7] py-4 mt-3 rounded-xl items-center"
              >
                <Text className="font-subtitle text-foreground">
                  {confirmText}
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </Pressable>
      </Modal>
    );
  },
);

BlockModal.displayName = 'BlockModal';
