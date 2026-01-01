import clsx from 'clsx';
import { StatusBar } from 'expo-status-bar';
import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { View, ViewProps } from 'react-native';

import { useThemeStore } from '@/stores/use-theme-store';
import { STATUSBAR_COLORS, THEME_COLORS, ThemeName } from '@/styles/themes';

type ThemeContextType = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

function getThemeStyle(theme: ThemeName) {
  return THEME_COLORS[theme]; // already uses nativewind's vars()
}

type ThemeProviderProps = ViewProps & {
  children: ReactNode;
};

export function ThemeProvider({
  children,
  className,
  ...rest
}: ThemeProviderProps) {
  const { currentTheme, changeTheme } = useThemeStore();

  const contextValue = useMemo(
    () => ({
      theme: currentTheme,
      setTheme: changeTheme,
    }),
    [currentTheme, changeTheme],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <View
        style={getThemeStyle(currentTheme)}
        className={clsx('flex-1', className)}
        {...rest}
      >
        <StatusBar
          style={STATUSBAR_COLORS[currentTheme].style}
          backgroundColor={STATUSBAR_COLORS[currentTheme].background}
        />
        {children}
      </View>
    </ThemeContext.Provider>
  );
}
