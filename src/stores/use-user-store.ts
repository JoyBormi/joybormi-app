// CHecks onboarding visited or not
import { storage } from '@/lib/mmkv';
import { EUserType, IUser } from '@/types/user.type';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface UserStoreState {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  removeUser: () => void;
  appType: EUserType;
  setAppType: (appType: EUserType) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  location: string | null;
  setLocation: (location: string | null) => void;
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
      location: null,
      setLocation: (location: string | null) => set({ location }),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => storage),
    },
  ),
);
