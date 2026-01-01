import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { BottomSheetScrollViewProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/types';
import { BottomSheetViewProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetView/types';
import React, { forwardRef } from 'react';
import { View } from 'react-native';

import { cn } from '@/lib/utils';

export type ScrollConfig = Partial<BottomSheetScrollViewProps> & {
  className?: string;
};

export type BottomSheetViewConfig = Partial<BottomSheetViewProps> & {
  className?: string;
};

interface CustomBottomSheetProps extends Omit<
  BottomSheetModalProps,
  'children'
> {
  scrollEnabled?: boolean;
  backdropConfig?: {
    pressBehavior?: 'none' | 'close' | 'collapse' | number;
    appearsOnIndex?: number;
    disappearsOnIndex?: number;
    enableTouchThrough?: boolean;
  };
  scrollConfig?: ScrollConfig;
  bottomSheetViewConfig?: BottomSheetViewConfig;
  children: React.ReactNode;
}

export const DEFAULT_SHEET_CONFIG: Partial<BottomSheetModalProps> = {
  index: -1,
  enablePanDownToClose: true,
  enableContentPanningGesture: true,
  handleIndicatorStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
};

const CustomBottomSheet = forwardRef<BottomSheetModal, CustomBottomSheetProps>(
  (
    {
      scrollEnabled = false,
      backdropConfig,
      scrollConfig,
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
        handleComponent={() => (
          <View className="bg-card backdrop-blur-xl flex justify-center rounded-t-3xl py-4 border-t border-border/10">
            <View className="h-1.5 w-[60px] rounded-full bg-muted-foreground/30 self-center" />
          </View>
        )}
      >
        {scrollEnabled ? (
          <BottomSheetScrollView
            {...scrollConfig}
            className={cn(
              'bg-card backdrop-blur-xl px-6 flex-1',
              scrollConfig?.className,
            )}
          >
            {children}
          </BottomSheetScrollView>
        ) : (
          <BottomSheetView
            {...bottomSheetViewConfig}
            className={cn(
              'bg-card backdrop-blur-xl px-6 flex-1',
              bottomSheetViewConfig?.className,
            )}
          >
            {children}
          </BottomSheetView>
        )}
      </BottomSheetModal>
    );
  },
);

CustomBottomSheet.displayName = 'CustomBottomSheet';

export default CustomBottomSheet;
