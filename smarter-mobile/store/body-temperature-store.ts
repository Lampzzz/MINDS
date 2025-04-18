import { create } from "zustand";
import { db } from "@/services/firebase/config";
import { BodyTemperature } from "@/types";
import {
  Unsubscribe,
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

interface BodyTemperatureState {
  bodyTemperatures: Record<string, BodyTemperature | null>;
  isLoading: boolean;
  error: string | null;
  unsubscribes: Record<string, Unsubscribe>;
  fetchBodyTemperature: (residentId: string) => Unsubscribe;
  reset: () => void;
  cleanup: () => void;
}

export const useBodyTemperatureStore = create<BodyTemperatureState>(
  (set, get) => ({
    bodyTemperatures: {},
    isLoading: false,
    error: null,
    unsubscribes: {},

    fetchBodyTemperature: (residentId: string) => {
      set({ isLoading: true });

      const q = query(
        collection(db, "bodyTemperatures"),
        where("residentId", "==", residentId),
        limit(1)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (snapshot.empty) {
            set((state) => ({
              bodyTemperatures: {
                ...state.bodyTemperatures,
                [residentId]: null,
              },
              isLoading: false,
              error: null,
            }));
            return;
          }
          const doc = snapshot.docs[0];
          const data = {
            id: doc.id,
            ...doc.data(),
          } as BodyTemperature;

          set((state) => ({
            bodyTemperatures: { ...state.bodyTemperatures, [residentId]: data },
            isLoading: false,
            error: null,
          }));
        },
        (error) => {
          console.error(`Error fetching temp for ${residentId}:`, error);
          set((state) => ({
            bodyTemperatures: { ...state.bodyTemperatures, [residentId]: null },
            isLoading: false,
            error: error.message,
          }));
        }
      );

      // Store the unsubscribe function
      set((state) => ({
        unsubscribes: { ...state.unsubscribes, [residentId]: unsubscribe },
      }));

      return unsubscribe;
    },

    reset: () => {
      set({
        bodyTemperatures: {},
        isLoading: false,
        error: null,
        unsubscribes: {},
      });
    },

    cleanup: () => {
      const { unsubscribes } = get();
      Object.values(unsubscribes).forEach((unsubscribe) => unsubscribe());
      get().reset();
    },
  })
);
