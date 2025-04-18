import { create } from "zustand";

interface MenuState {
  isVisible: boolean;
  type: string;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useMenu = create<MenuState>((set) => ({
  isVisible: false,
  type: "",
  open: () => set({ isVisible: true }),
  close: () => set({ isVisible: false }),
  toggle: () => set((state) => ({ isVisible: !state.isVisible })),
}));
