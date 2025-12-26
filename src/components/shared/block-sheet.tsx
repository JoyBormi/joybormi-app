import Icons from '@/lib/icons';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Animated, Easing, Modal, Pressable, Text, View } from 'react-native';
import { Button } from '../ui';

interface BlockedSheetProps {
  title?: string;
  subtitle?: string;
  confirmText?: string;
  cancelText?: string;
  allowBackdropPress?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface BlockedSheetRef {
  show: () => void;
  hide: () => void;
}

export const BlockedSheet = forwardRef<BlockedSheetRef, BlockedSheetProps>(
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
            className="bg-card rounded-3xl w-full max-w-md items-center px-6 pt-8 pb-10"
          >
            <View className="w-14 h-14 rounded-full bg-red-500/15 items-center justify-center mb-3">
              <Icons.Ban className="w-7 h-7 text-red-500" />
            </View>

            <Text className="text-xl font-heading text-center mb-1">
              {title}
            </Text>

            <Text className="text-muted-foreground text-center mb-4">
              {subtitle}
            </Text>

            <Button
              onPress={() => {
                hide();
                onCancel?.();
              }}
              variant="outline"
              size="action"
              className="mt-2 border-destructive px-8"
            >
              <Text className="font-subtitle text-destructive">
                {cancelText}
              </Text>
            </Button>

            <Pressable
              onPress={() => {
                hide();
                onConfirm?.();
              }}
              className="bg-primary w-full py-4 mt-3 rounded-xl items-center"
            >
              <Text className="font-subtitle text-primary-foreground">
                {confirmText}
              </Text>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    );
  },
);

BlockedSheet.displayName = 'BlockedSheet';
