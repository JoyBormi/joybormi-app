import { create } from 'zustand';

interface AuthFlowState {
  resetToken: string | null;
  setResetToken: (token: string) => void;
  clearResetToken: () => void;
}

export const useAuthFlowStore = create<AuthFlowState>((set) => ({
  resetToken: null,
  setResetToken: (token) => set({ resetToken: token }),
  clearResetToken: () => set({ resetToken: null }),
}));
