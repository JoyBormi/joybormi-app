import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  View,
} from 'react-native';

import { Feedback } from '@/lib/haptics';

import { Button, Input, Text } from '../ui';

interface DeleteModalProps {
  onConfirm: () => void;
  onCancel?: () => void;
}

export interface DeleteModalRef {
  show: () => void;
  hide: () => void;
}

export const DeleteModal = forwardRef<DeleteModalRef, DeleteModalProps>(
  ({ onConfirm, onCancel }, ref) => {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [keyword, setKeyword] = useState('');

    const targetKeyword = t('common.deleteModal.keyword');
    const isMatched =
      keyword.trim().toUpperCase() === targetKeyword.toUpperCase();

    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.96)).current;

    const animateIn = () => {
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

    const animateOut = (onDone?: () => void) => {
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
      ]).start(() => {
        setVisible(false);
        onDone?.();
      });
    };

    const show = () => {
      setKeyword('');
      setVisible(true);
      requestAnimationFrame(animateIn);
    };

    const hide = () => {
      Keyboard.dismiss();
      animateOut();
    };

    useImperativeHandle(ref, () => ({ show, hide }));

    const handleConfirm = () => {
      if (!isMatched) {
        Feedback.error();
        return;
      }

      Feedback.medium();
      Keyboard.dismiss();
      animateOut(onConfirm);
    };

    if (!visible) return null;

    return (
      <Modal
        visible={visible}
        transparent
        animationType="none"
        statusBarTranslucent
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1 bg-red-500"
        >
          {/* Backdrop */}
          <Pressable
            className="flex-1 bg-black/50 items-center justify-center px-4"
            onPress={hide}
          >
            {/* Modal Content */}
            <Animated.View
              style={{
                opacity,
                transform: [{ scale }],
              }}
              className="bg-card rounded-3xl w-full max-w-md px-6 pt-10 pb-8 border border-border/50"
            >
              <Text className="text-foreground font-heading text-xl text-center mb-2">
                {t('common.deleteModal.title')}
              </Text>

              <Text className="text-muted-foreground text-center mb-8">
                {t('common.deleteModal.description', {
                  keyword: targetKeyword,
                })}
              </Text>

              <Input
                placeholder={t('common.deleteModal.placeholder')}
                value={keyword}
                onChangeText={setKeyword}
                autoCapitalize="characters"
                className="mb-8"
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleConfirm}
              />

              <View className="flex-row justify-between gap-2">
                <Button
                  onPress={() => {
                    hide();
                    onCancel?.();
                  }}
                  variant="ghost"
                >
                  <Text>{t('common.buttons.cancel')}</Text>
                </Button>

                <Button
                  onPress={handleConfirm}
                  disabled={!isMatched}
                  variant="destructive"
                >
                  <Text>{t('common.deleteModal.button')}</Text>
                </Button>
              </View>
            </Animated.View>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    );
  },
);

DeleteModal.displayName = 'DeleteModal';
