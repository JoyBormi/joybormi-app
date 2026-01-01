import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';

import { useThemeStore } from '@/stores/use-theme-store';
import { THEMES_HEX } from '@/styles/themes';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const { colorScheme, setColorScheme } = useNativewindColorScheme();
  const { currentTheme, changeTheme } = useThemeStore();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // Sync NativeWind color scheme with theme store
  useEffect(() => {
    if (hasHydrated) {
      setColorScheme(currentTheme);
    }
  }, [currentTheme, setColorScheme, hasHydrated]);

  const effectiveColorScheme = hasHydrated ? colorScheme : 'light';

  return {
    colorScheme: effectiveColorScheme,
    isDarkColorScheme: effectiveColorScheme === 'dark',
    setColorScheme,
    changeTheme,
    colors: THEMES_HEX[currentTheme].colors,
  };
}
