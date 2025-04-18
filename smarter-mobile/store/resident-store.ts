import { create } from "zustand";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/services/firebase/config";
import { Manager, Member } from "@/types";
import { ErrorHandler } from "@/lib/utils";

interface ResidentState {
  manager: Manager | null;
  members: Member[];
  isLoading: boolean;
  error: string | null;
}

interface ResidentActions {
  fetchMembers: (managerId: string) => Promise<void>;
  fetchManager: (managerId: string) => Promise<void>;
  resetResidents: () => void;
}

interface ResidentStore extends ResidentState, ResidentActions {}

export const useResidentStore = create<ResidentStore>((set) => ({
  // Initial state
  manager: null,
  members: [],
  isLoading: false,
  error: null,

  fetchMembers: async (managerId: string) => {
    if (!managerId) {
      set({ error: "Manager ID is required" });
      return;
    }

    try {
      set({ isLoading: true, error: null });

      const membersQuery = query(
        collection(db, "members"),
        where("managerId", "==", managerId)
      );

      const membersSnapshot = await getDocs(membersQuery);
      const membersData = membersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Member[];

      set({
        members: membersData,
        isLoading: false,
      });
    } catch (error) {
      ErrorHandler(error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch members",
        isLoading: false,
      });
    }
  },

  fetchManager: async (managerId: string) => {
    if (!managerId) {
      set({ error: "Manager ID is required" });
      return;
    }

    try {
      set({ isLoading: true, error: null });

      const managerQuery = query(
        collection(db, "managers"),
        where("id", "==", managerId)
      );

      const managerSnapshot = await getDocs(managerQuery);
      if (!managerSnapshot.empty) {
        const managerData = {
          id: managerSnapshot.docs[0].id,
          ...managerSnapshot.docs[0].data(),
        } as Manager;

        set({
          manager: managerData,
          isLoading: false,
        });
      } else {
        set({
          error: "Manager not found",
          isLoading: false,
        });
      }
    } catch (error) {
      ErrorHandler(error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch manager",
        isLoading: false,
      });
    }
  },

  resetResidents: () => {
    set({
      manager: null,
      members: [],
      isLoading: false,
      error: null,
    });
  },
}));

export default useResidentStore;
