import { BottomSheetModalProps } from '@gorhom/bottom-sheet';
import { BottomSheetScrollViewProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/types';
import { BottomSheetViewProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetView/types';
import React from 'react';

export type ScrollConfig = Partial<BottomSheetScrollViewProps> & {
  className?: string;
};

export type BottomSheetViewConfig = Partial<BottomSheetViewProps> & {
  className?: string;
};

export interface CustomBottomSheetProps extends Omit<
  BottomSheetModalProps,
  'children'
> {
  grabbable?: boolean;
  backdropConfig?: {
    pressBehavior?: 'none' | 'close' | 'collapse' | number;
    appearsOnIndex?: number;
    disappearsOnIndex?: number;
    enableTouchThrough?: boolean;
  };
  bottomSheetViewConfig?: BottomSheetViewConfig;
  children: React.ReactNode;
}

export interface ScrollSheetProps extends Omit<
  BottomSheetModalProps,
  'children'
> {
  grabbable?: boolean;
  backdropConfig?: {
    pressBehavior?: 'none' | 'close' | 'collapse' | number;
    appearsOnIndex?: number;
    disappearsOnIndex?: number;
    enableTouchThrough?: boolean;
  };
  scrollConfig?: ScrollConfig;
  children: React.ReactNode;
}

export interface DetachedSheetProps extends Omit<
  BottomSheetModalProps,
  'children'
> {
  grabbable?: boolean;
  backdropConfig?: {
    pressBehavior?: 'none' | 'close' | 'collapse' | number;
    appearsOnIndex?: number;
    disappearsOnIndex?: number;
    enableTouchThrough?: boolean;
  };
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
