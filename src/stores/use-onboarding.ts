// CHecks onboarding visited or not
import { storage } from '@/lib/mmkv';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface OnboardingState {
  visited: boolean;
  canVisitAgain: boolean;
  setVisited: () => void;
  setCanVisitAgain: (canVisitAgain: boolean) => void;
}

export const useOnboarding = create<OnboardingState>()(
  persist(
    (set) => ({
      visited: false,
      canVisitAgain: true, // Set to true by default to allow first visit
      setVisited: () => set({ visited: true }),
      setCanVisitAgain: (canVisitAgain: boolean) => set({ canVisitAgain }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => storage),
    },
  ),
);
