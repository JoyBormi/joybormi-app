import { OfflineModal } from '@/components/shared';
import { setupFocusManager } from '@/lib/tanstack-query/focus-manager';
import { setupOnlineManager } from '@/lib/tanstack-query/online-manager';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { PortalHost } from '@rn-primitives/portal';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GlobalAlert } from './alert';
import { I18nProvider } from './intl';
import { QueryProvider } from './query';
import { ThemeProvider } from './theme';

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
              <PortalHost />
              <OfflineModal />
              <GlobalAlert />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </QueryProvider>
      </ThemeProvider>
    </I18nProvider>
  );
};

export default RootProvider;
