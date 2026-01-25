import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import React, { forwardRef } from 'react';
import { View } from 'react-native';

import { cn } from '@/lib/utils';

import { DEFAULT_SHEET_CONFIG, ScrollSheetProps } from './bottom-sheet.types';

const ScrollSheet = forwardRef<BottomSheetModal, ScrollSheetProps>(
  (
    { grabbable = true, backdropConfig, scrollConfig, children, ...config },
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
        <BottomSheetScrollView
          {...scrollConfig}
          className={cn(
            'bg-card backdrop-blur-xl px-6 flex-1',
            scrollConfig?.className,
          )}
        >
          {grabbable && (
            <View className="bg-card backdrop-blur-xl flex justify-center rounded-t-3xl py-4 border-t border-border/10">
              <View className="h-1.5 w-[60px] rounded-full bg-muted-foreground/30 self-center" />
            </View>
          )}
          {children}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);

ScrollSheet.displayName = 'ScrollSheet';

export { ScrollSheet };
