import CustomBottomSheet from '@/components/shared/bottom-sheet';
import Icons from '@/lib/icons';
import {
  BottomSheetModal,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import React, { forwardRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../ui';

interface BlockedSheetProps {
  title?: string;
  subtitle?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const BlockedSheet = forwardRef<BottomSheetModal, BlockedSheetProps>(
  (props, ref) => {
    const {
      title = 'Hey, be careful!',
      subtitle = 'Your action may have negative consequences',
      confirmText = 'Got it',
      cancelText = 'Anyways, just close',
      onConfirm,
      onCancel,
    } = props;
    const insets = useSafeAreaInsets();

    const animationConfigs = useBottomSheetTimingConfigs({
      duration: 150,
    });

    return (
      <CustomBottomSheet
        ref={ref}
        index={0}
        detached
        fullWindow
        bottomInset={insets.bottom}
        animationConfigs={animationConfigs}
        style={{
          paddingHorizontal: 12,
        }}
        bottomSheetViewConfig={{
          className: 'rounded-b-3xl',
        }}
      >
        <View className="items-center px-6 pb-8 gap-4">
          <View className="w-14 h-14 rounded-full bg-red-500/15 items-center justify-center">
            <Icons.Ban className="w-7 h-7 text-red-500" />
          </View>

          <Text className="text-xl font-heading text-center">{title}</Text>

          <Text className="text-muted-foreground text-center">{subtitle}</Text>
          <Button
            onPress={() => {
              if (ref) {
                'current' in ref && ref.current?.dismiss();
              }
              onCancel?.();
            }}
            variant="outline"
            size="action"
            className="mt-4 border-destructive px-4"
          >
            <Text className="font-subtitle text-destructive">{cancelText}</Text>
          </Button>

          <TouchableOpacity
            onPress={onConfirm}
            className="bg-primary px-16 py-3 rounded-xl"
          >
            <Text className="font-subtitle">{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </CustomBottomSheet>
    );
  },
);

BlockedSheet.displayName = 'BlockedSheet';
