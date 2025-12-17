import { storage } from '@/lib/mmkv';
import { ThemeName } from '@/styles/themes';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ThemeState {
  currentTheme: ThemeName;
  changeTheme: (theme: ThemeName) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      currentTheme: 'light',
      changeTheme: (theme: ThemeName) => set({ currentTheme: theme }),
    }),
    {
      name: 'theme-store',
      storage: createJSONStorage(() => storage),
    },
  ),
);
