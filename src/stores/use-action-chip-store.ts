import { create } from 'zustand';

type ActionChipPayload = {
  id?: string;
  text: string;
  progress?: number;
};

interface ActionChipState {
  visible: boolean;
  id: string | null;
  text: string;
  progress: number | null;
  show: (payload: ActionChipPayload) => void;
  update: (payload: Partial<ActionChipPayload>) => void;
  hide: (id?: string) => void;
  reset: () => void;
}

const clampProgress = (progress?: number): number | null => {
  if (progress === undefined || Number.isNaN(progress)) return null;
  return Math.max(0, Math.min(100, Math.round(progress)));
};

export const useActionChipStore = create<ActionChipState>((set, get) => ({
  visible: false,
  id: null,
  text: 'Action Chip',
  progress: null,
  show: ({ id = `action-${Date.now()}`, text, progress }) =>
    set({
      visible: true,
      id,
      text,
      progress: clampProgress(progress),
    }),
  update: ({ id, text, progress }) => {
    const current = get();
    if (id && current.id && id !== current.id) return;

    set({
      visible: true,
      text: text ?? current.text,
      progress:
        progress !== undefined ? clampProgress(progress) : current.progress,
    });
  },
  hide: (id) => {
    const current = get();
    if (id && current.id && id !== current.id) return;
    set({ visible: false, id: null, text: '', progress: null });
  },
  reset: () => set({ visible: false, id: null, text: '', progress: null }),
}));

export const actionChip = {
  show: (payload: ActionChipPayload) =>
    useActionChipStore.getState().show(payload),
  update: (payload: Partial<ActionChipPayload>) =>
    useActionChipStore.getState().update(payload),
  hide: (id?: string) => useActionChipStore.getState().hide(id),
  reset: () => useActionChipStore.getState().reset(),
};
