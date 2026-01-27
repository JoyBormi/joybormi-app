import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { storage } from '@/lib/mmkv';

export interface PreferencesStoreState {
  language: string;
  setLanguage: (language: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  location: string | null;
  setLocation: (location: string | null) => void;
  theme: string;
  setTheme: (theme: string) => void;
}

export const usePreferencesStore = create<PreferencesStoreState>()(
  persist(
    (set) => ({
      language: 'ru',
      setLanguage: (language: string) => set({ language }),
      currency: 'UZS',
      setCurrency: (currency: string) => set({ currency }),
      location: null,
      setLocation: (location: string | null) => set({ location }),
      theme: 'light',
      setTheme: (theme: string) => set({ theme }),
    }),
    {
      name: 'preferences-store',
      storage: createJSONStorage(() => storage),
    },
  ),
);
