import { create } from "zustand";

interface BottomSheetState {
  isVisible: boolean;
  type: string;
  data: any;
  open: (type: string) => void;
  close: () => void;
  setType: (type: string) => void;
  setData: (data: any) => void;
}

export const useBottomSheet = create<BottomSheetState>((set) => ({
  isVisible: false,
  type: "",
  data: null,
  open: (type: string) => set({ isVisible: true, type }),
  close: () => set({ isVisible: false, type: "", data: null }),
  setType: (type: string) => set({ type }),
  setData: (data: any) => set({ data }),
}));
