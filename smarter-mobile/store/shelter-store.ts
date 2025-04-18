import { create } from "zustand";
import { getShelter } from "@/services/firebase/firestore/shelter";
import { ErrorHandler } from "@/lib/utils";
import { Shelter } from "@/types";

interface ShelterStore {
  shelter: Shelter | null;
  isLoading: boolean;
  error: string | null;
  fetchShelter: (managerId: string) => Promise<void>;
  resetShelter: () => void;
}

export const useShelterStore = create<ShelterStore>((set) => ({
  shelter: null,
  isLoading: false,
  error: null,

  fetchShelter: async (managerId: string) => {
    set({ isLoading: true, error: null });

    try {
      const data = await getShelter(managerId);
      set({ shelter: data, isLoading: false });
    } catch (error) {
      set({ error: ErrorHandler(error), isLoading: false, shelter: null });
    }
  },

  resetShelter: () => {
    set({ shelter: null, error: null, isLoading: false });
  },
}));
