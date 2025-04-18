import { create } from "zustand";
import { Unsubscribe } from "firebase/auth";
import { ThresholdAlert } from "@/types";
import { ErrorHandler } from "@/lib/utils";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/firebase/config";

interface ThresholdAlertState {
  thresholdAlert: ThresholdAlert | null;
  error: string | null;
  fetchThresholdAlert: () => void;
  unsubscribe?: Unsubscribe;
  cleanup: () => void;
}

export const useThresholdAlertStore = create<ThresholdAlertState>(
  (set, get) => ({
    thresholdAlert: null,
    error: null,

    fetchThresholdAlert: async () => {
      set({ error: null });

      try {
        const thresholdAlertQuery = query(
          collection(db, "thresholdAlerts"),
          orderBy("createdAt", "desc"),
          limit(1)
        );

        const unsubscribe = onSnapshot(
          thresholdAlertQuery,
          async (snapshot) => {
            try {
              const thresholdAlert = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              })) as ThresholdAlert[];

              set({ thresholdAlert: thresholdAlert[0], error: null });
            } catch (error: unknown) {
              set({
                thresholdAlert: null,
                error: ErrorHandler(error, "Get Threshold Alert"),
              });
            }
          }
        );

        set({ unsubscribe });
      } catch (error: unknown) {
        set({
          thresholdAlert: null,
          error: ErrorHandler(error, "Get Threshold Alert"),
        });
      }
    },

    cleanup: () => {
      const { unsubscribe } = get();
      if (unsubscribe) unsubscribe();

      set({ thresholdAlert: null, error: null });
    },
  })
);
