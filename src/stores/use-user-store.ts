// CHecks onboarding visited or not
import { storage } from '@/lib/mmkv';
import { EUserType, IUser } from 'types/user.type';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface UserStoreState {
  user: IUser;
  setUser: (user: IUser) => void;
  removeUser: () => void;
  appType: EUserType;
  setAppType: (appType: EUserType) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const DEFAULT_USER: IUser = {
  type: EUserType.USER,
  username: '',
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  avatar: '',
  tokens: {
    accessToken: '',
    refreshToken: '',
  },
};

export const useUserStore = create<UserStoreState>()(
  persist(
    (set) => ({
      user: DEFAULT_USER,
      setUser: (user: IUser) => set({ user }),
      removeUser: () =>
        set({
          user: DEFAULT_USER,
        }),
      appType: EUserType.GUEST,
      setAppType: (appType: EUserType) => set({ appType }),
      isLoggedIn: true,
      setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => storage),
    },
  ),
);
