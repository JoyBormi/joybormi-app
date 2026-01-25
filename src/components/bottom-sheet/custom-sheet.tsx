import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { forwardRef } from 'react';
import { View } from 'react-native';

import { cn } from '@/lib/utils';

import {
  CustomBottomSheetProps,
  DEFAULT_SHEET_CONFIG,
} from './bottom-sheet.types';

const CustomBottomSheet = forwardRef<BottomSheetModal, CustomBottomSheetProps>(
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

CustomBottomSheet.displayName = 'CustomBottomSheet';

export { CustomBottomSheet };
