import { create } from "zustand";
import {
  Unsubscribe,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/services/firebase/config";
import { Analytics } from "@/types";
import { ErrorHandler } from "@/lib/utils";

interface AnalyticsState {
  analytics: Analytics[];
  latestAnalytics: Analytics | null;
  isLoading: boolean;
  error: string | null;
  unsubscribe?: Unsubscribe;
}

interface AnalyticsActions {
  fetchAnalytics: (shelterDeviceId: string) => Promise<void>;
  resetAnalytics: () => void;
  cleanup: () => void;
}

interface AnalyticsStore extends AnalyticsState, AnalyticsActions {}

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  analytics: [],
  latestAnalytics: null,
  isLoading: false,
  error: null,
  unsubscribe: undefined,

  fetchAnalytics: async (shelterDeviceId: string) => {
    if (!shelterDeviceId) {
      set({ error: "No shelter device ID provided" });
      return;
    }

    get().cleanup();

    set({ isLoading: true, error: null });

    try {
      const analyticsQuery = query(
        collection(db, "analytics"),
        where("shelterDeviceId", "==", shelterDeviceId),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(
        analyticsQuery,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt,
          })) as Analytics[];

          set({
            analytics: data,
            latestAnalytics: data[0] || null,
            isLoading: false,
            error: null,
          });
        },
        (error) => {
          ErrorHandler(error);
          set({
            error: error.message,
            isLoading: false,
          });
        }
      );

      set({ unsubscribe });
    } catch (error) {
      ErrorHandler(error);
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
        isLoading: false,
      });
    }
  },

  resetAnalytics: () => {
    set({
      analytics: [],
      latestAnalytics: null,
      error: null,
      isLoading: false,
    });
  },

  cleanup: () => {
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
    }
    get().resetAnalytics();
  },
}));

export default useAnalyticsStore;
