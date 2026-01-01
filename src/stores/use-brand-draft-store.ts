import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { storage } from '@/lib/mmkv';
import { TCreateBrandInput } from '@/lib/validations/brand';

interface BrandDraftStore {
  draftData: Partial<TCreateBrandInput> | null;
  currentStep: number;
  saveDraft: (data: Partial<TCreateBrandInput>, step: number) => void;
  clearDraft: () => void;
  hasDraft: () => boolean;
}

export const useBrandDraftStore = create<BrandDraftStore>()(
  persist(
    (set, get) => ({
      draftData: null,
      currentStep: 0,

      saveDraft: (data, step) => {
        set({ draftData: data, currentStep: step });
      },

      clearDraft: () => {
        set({ draftData: null, currentStep: 0 });
      },

      hasDraft: () => {
        const { draftData } = get();
        return draftData !== null && Object.keys(draftData).length > 0;
      },
    }),
    {
      name: 'brand-draft-storage',
      storage: createJSONStorage(() => storage),
    },
  ),
);
