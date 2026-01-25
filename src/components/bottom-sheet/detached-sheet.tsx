import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { forwardRef } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from '@/lib/utils';

import { DEFAULT_SHEET_CONFIG, DetachedSheetProps } from './bottom-sheet.types';

const DetachedSheet = forwardRef<BottomSheetModal, DetachedSheetProps>(
  (
    {
      grabbable = true,
      backdropConfig,
      bottomSheetViewConfig,
      children,
      ...config
    },
    ref,
  ) => {
    const insets = useSafeAreaInsets();
    return (
      <BottomSheetModal
        ref={ref}
        {...DEFAULT_SHEET_CONFIG}
        {...config}
        backdropComponent={(backdropProps) => (
          <BottomSheetBackdrop
            {...backdropProps}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            enableTouchThrough={false}
            {...backdropConfig}
          />
        )}
        backgroundStyle={{
          backgroundColor: 'transparent',
        }}
        bottomInset={insets.bottom}
        handleComponent={() => null}
      >
        <BottomSheetView
          {...bottomSheetViewConfig}
          className={cn(
            'bg-card backdrop-blur-xl px-6 flex-1',
            bottomSheetViewConfig?.className,
          )}
        >
          {grabbable && (
            <View className="bg-card backdrop-blur-xl flex justify-center rounded-t-3xl py-4 border-t border-border/10">
              <View className="h-1.5 w-[60px] rounded-full bg-muted-foreground/30 self-center" />
            </View>
          )}
          {children}
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

DetachedSheet.displayName = 'DetachedSheet';

export { DetachedSheet };
