import { setupFocusManager } from '@/lib/tanstack-query/focus-manager';
import { setupOnlineManager } from '@/lib/tanstack-query/online-manager';
import { queryClient } from '@/lib/tanstack-query/query-client';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { PortalHost } from '@rn-primitives/portal';
import { QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { I18nProvider } from './intl';
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
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              {children}
              <PortalHost />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ThemeProvider>
    </I18nProvider>
  );
};

export default RootProvider;
