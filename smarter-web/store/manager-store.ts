import { create } from "zustand";
import { Manager, UserFilterTypes } from "@/types";
import { db } from "@/firebase/config";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
} from "firebase/firestore";
import {
  getManagerById,
  getManagersByAssigned,
} from "@/firebase/firestore/manager";
import { formatBirthDate } from "@/lib/utils";

interface ManagerState {
  managers: Manager[] | null;
  manager: Manager | null;
  assignedManagers: Manager[] | null;
  totalData: number;
  isLoading: boolean;
  error: string | null;
  fetchManagers: (filters?: UserFilterTypes) => Promise<void>;
  fetchManager: (id: string) => Promise<void>;
  fetchAssignedManager: (isAssigned: boolean) => Promise<void>;
  cleanup: () => void;
  resetManagers: () => void;
  unsubscribe?: Unsubscribe;
}

const useManagerStore = create<ManagerState>((set, get) => ({
  managers: [],
  manager: null,
  assignedManagers: [],
  totalData: 0,
  isLoading: false,
  error: null,
  unsubscribe: undefined,

  async fetchManagers(filters?: UserFilterTypes) {
    get().cleanup();
    set({ isLoading: true, error: null });

    try {
      const managersQuery = query(
        collection(db, "managers"),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(
        managersQuery,
        async (snapshot) => {
          try {
            const managers = await Promise.all(
              snapshot.docs.map(async (doc) => {
                return {
                  id: doc.id,
                  ...doc.data(),
                  age: formatBirthDate(doc.data().dateOfBirth),
                } as Manager;
              })
            );

            let filteredManagers = managers;

            if (filters) {
              const genderArray = filters.genders
                ? filters.genders.split(".")
                : [];

              if (genderArray.length > 0) {
                filteredManagers = filteredManagers.filter((value) =>
                  genderArray.includes(value.gender)
                );
              }

              if (filters.search) {
                filteredManagers = filteredManagers.filter((value) =>
                  value.fullName
                    .toLowerCase()
                    .includes(filters.search!.toLowerCase())
                );
              }
            }

            set({
              managers: filteredManagers,
              totalData: managers.length,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "An unknown error occurred",
              isLoading: false,
            });
          }
        },
        (error) => {
          set({
            error: error.message,
            isLoading: false,
          });
        }
      );

      set({ unsubscribe });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
        isLoading: false,
      });
    }
  },

  async fetchAssignedManager(isAssigned: boolean) {
    const data = await getManagersByAssigned(isAssigned);
    set({ assignedManagers: data });
  },

  fetchManager: async (id: string) => {
    try {
      const data = await getManagerById(id);

      set({ manager: data });
    } catch (error) {
      console.error(error);
      set({ manager: null });
    }
  },

  resetManagers: () => {
    set({
      managers: [],
      assignedManagers: [],
      error: null,
      isLoading: false,
    });
  },

  cleanup: () => {
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
    }
    get().resetManagers();
  },
}));

export default useManagerStore;
