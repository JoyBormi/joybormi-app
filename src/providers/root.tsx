import { PortalHost } from '@rn-primitives/portal';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { I18nProvider } from './intl';
import { ThemeProvider } from './theme';

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <I18nProvider>
      <ThemeProvider>
        <GestureHandlerRootView>{children}</GestureHandlerRootView>
        <PortalHost />
      </ThemeProvider>
    </I18nProvider>
  );
};

export default RootProvider;
