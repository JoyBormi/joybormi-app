import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import { useEffect } from 'react';

import { useThemeStore } from '@/stores/use-theme-store';
import { THEMES_HEX } from '@/styles/themes';

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } =
    useNativewindColorScheme();
  const { currentTheme, changeTheme } = useThemeStore();

  // Sync NativeWind color scheme with theme store
  useEffect(() => {
    if (colorScheme !== currentTheme) {
      toggleColorScheme();
    }
  }, [currentTheme, colorScheme, toggleColorScheme]);

  return {
    colorScheme,
    isDarkColorScheme: colorScheme === 'dark',
    setColorScheme,
    changeTheme,
    colors: THEMES_HEX[currentTheme].colors,
  };
}
