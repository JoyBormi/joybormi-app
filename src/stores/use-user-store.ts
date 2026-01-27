import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { storage } from '@/lib/mmkv';
import { EUserType, IUser } from '@/types/user.type';

export interface UserStoreState {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  removeUser: () => void;
  appType: EUserType;
  setAppType: (appType: EUserType) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export const useUserStore = create<UserStoreState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: IUser | null) => set({ user }),
      removeUser: () => set({ user: null }),
      appType: EUserType.GUEST,
      setAppType: (appType: EUserType) => set({ appType }),
      isLoggedIn: false,
      setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => storage),
    },
  ),
);
