import CustomBottomSheet from '@/components/shared/bottom-sheet';
import Icons from '@/lib/icons';
import {
  BottomSheetModal,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import React, { forwardRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const UserTypeBlockedSheet = forwardRef<BottomSheetModal>((_, ref) => {
  const insets = useSafeAreaInsets();

  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 150,
  });

  return (
    <CustomBottomSheet
      ref={ref}
      index={0}
      detached
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

        <Text className="text-xl font-heading text-center">
          Action Not Allowed
        </Text>

        <Text className="text-muted-foreground text-center">
          This role change is not permitted.
        </Text>

        <TouchableOpacity
          onPress={() => {
            if (ref) {
              'current' in ref && ref.current?.dismiss();
            }
          }}
          className="mt-4 bg-muted px-6 py-3 rounded-xl"
        >
          <Text className="font-subtitle">Got it</Text>
        </TouchableOpacity>
      </View>
    </CustomBottomSheet>
  );
});

UserTypeBlockedSheet.displayName = 'UserTypeBlockedSheet';
