import { create } from "zustand";
import { db } from "@/services/firebase/config";
import { Controller } from "@/types";
import {
  Unsubscribe,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

interface ControllerState {
  controllerStatus: Controller | null;
  isLoading: boolean;
  error: string | null;
  unsubscribe?: Unsubscribe;
  fetchControllerStatus: (id: string) => void;
  cleanup: () => void;
}

const useControllerStore = create<ControllerState>((set, get) => ({
  controllerStatus: null,
  isLoading: false,
  error: null,

  fetchControllerStatus: (id: string) => {
    set({ isLoading: true });

    try {
      const q = query(
        collection(db, "controllers"),
        where("__name__", "in", ["door", "inverter"]),
        where("shelterDeviceId", "==", id)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const controllerData = {
            door: "",
            inverter: "",
            shelterDeviceId: "",
          };

          snapshot.docs.forEach((doc) => {
            const data = doc.data();
            const docName = doc.id;

            if (docName === "door") {
              controllerData.door = data.status;
            } else if (docName === "inverter") {
              controllerData.inverter = data.status;
            }

            controllerData.shelterDeviceId = data.shelterDeviceId;
          });

          set({
            controllerStatus: controllerData,
            isLoading: false,
            error: null,
          });
        },
        (error) => {
          set({
            error: error.message,
            isLoading: false,
          });
        }
      );

      set({ unsubscribe });

      return unsubscribe;
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  cleanup: () => {
    set((state) => {
      state.unsubscribe?.();
      return {
        controller: null,
        unsubscribe: undefined,
        isLoading: false,
        error: null,
      };
    });
  },
}));

export default useControllerStore;
