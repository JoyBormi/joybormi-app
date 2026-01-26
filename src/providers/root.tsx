import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { OfflineModal } from '@/components/shared';
import { setupFocusManager } from '@/lib/tanstack-query/focus-manager';
import { setupOnlineManager } from '@/lib/tanstack-query/online-manager';

import { GlobalAlert } from './alert';
import { I18nProvider } from './intl';
import { QueryProvider } from './query';
import { ThemeProvider } from './theme';
import { ToastProvider } from './toaster';

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  // Setup React Query managers on mount
  useEffect(() => {
    setupOnlineManager();
    setupFocusManager();
  }, []);

  return (
    <I18nProvider>
      <ThemeProvider>
        <QueryProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              {children}
              <OfflineModal />
              <GlobalAlert />
              <ToastProvider />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </QueryProvider>
      </ThemeProvider>
    </I18nProvider>
  );
};

export default RootProvider;
