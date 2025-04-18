import { create } from "zustand";
import { db } from "@/firebase/config";
import {
  collection,
  onSnapshot,
  query,
  where,
  Unsubscribe,
} from "firebase/firestore";

export interface Controller {
  inverter?: string;
  door?: string;
}

export interface ControllerState {
  controllers: Controller;
  isLoading: boolean;
  error: string | null;
  unsubscribe?: Unsubscribe;
  fetchControllers: (shelterDeviceId: string) => Promise<void>;
  reset: () => void;
  cleanup: () => void;
}

export const useControllersStore = create<ControllerState>((set, get) => ({
  controllers: {},
  isLoading: false,
  error: null,
  unsubscribe: undefined,

  fetchControllers: async (shelterDeviceId: string) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const q = query(
        collection(db, "controllers"),
        where("shelterDeviceId", "==", shelterDeviceId)
      );

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const controllers: Controller = {};
          querySnapshot.forEach((doc) => {
            // console.log("doc", doc.data());

            if (doc.id === "inverter") {
              controllers.inverter = doc.data().status;
            }
            if (doc.id === "door") {
              controllers.door = doc.data().status;
            }
          });

          set({
            controllers,
            isLoading: false,
          });
        },
        (error) => {
          set({
            error: error.message || "Failed to fetch controllers",
            isLoading: false,
          });
        }
      );

      set({ unsubscribe });
    } catch (error: any) {
      set({
        error: error.message || "An unexpected error occurred",
        isLoading: false,
      });
    }
  },

  reset: () => {
    set({
      controllers: {},
      isLoading: false,
      error: null,
    });
  },

  cleanup: () => {
    const { unsubscribe } = get();

    if (unsubscribe) {
      unsubscribe();
    }

    set({
      controllers: {},
      isLoading: false,
      error: null,
      unsubscribe: undefined,
    });
  },
}));

export type DataStore = ReturnType<typeof useControllersStore>;
