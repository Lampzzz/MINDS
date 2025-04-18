import { create } from "zustand";

interface OverviewFilterStore {
  month: string;
  year: string;
  setMonth: (month: string) => void;
  setYear: (year: string) => void;
}

export const useOverviewFilter = create<OverviewFilterStore>((set) => ({
  month: "all",
  year: "all",
  setMonth: (month: string) => set({ month }),
  setYear: (year: string) => set({ year }),
}));
