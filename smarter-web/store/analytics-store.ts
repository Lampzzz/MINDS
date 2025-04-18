import { create } from "zustand";
import { getShelterDevice } from "@/firebase/firestore/shelter";
import { Analytics } from "@/types";
import { db } from "@/firebase/config";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
} from "firebase/firestore";
import { displayShelterName, formatDisplayDate } from "@/lib/utils";

interface ShelterFilterTypes {
  page?: number;
  limit?: number;
  status?: string;
  location?: string;
  search?: string;
}

interface AnalyticsState {
  analytics: Analytics[] | null;
  totalData: number;
  isLoading: boolean;
  error: string | null;
  unsubscribe?: Unsubscribe;
  cleanup: () => void;
  reset: () => void;
  fetchSheltersAnalytics: (filters?: ShelterFilterTypes) => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  analytics: [],
  totalData: 0,
  isLoading: false,
  error: null,
  unsubscribe: undefined,

  async fetchSheltersAnalytics(filters) {
    get().cleanup();
    set({ isLoading: true, error: null });

    try {
      const analyticsQuery = query(
        collection(db, "analytics"),
        orderBy("createdAt", "asc")
      );

      const unsubscribe = onSnapshot(
        analyticsQuery,
        async (snapshot) => {
          try {
            const analyticsMap = new Map<string, Analytics>();

            await Promise.all(
              snapshot.docs.map(async (doc) => {
                const data = doc.data();
                const shelterDeviceId = data.shelterDeviceId;

                if (!shelterDeviceId) return;

                if (!analyticsMap.has(shelterDeviceId)) {
                  const shelterDevice = await getShelterDevice(shelterDeviceId);

                  const analyticsEntry = {
                    ...data,
                    id: doc.id,
                    createdAt: formatDisplayDate(data.createdAt),
                    shelterName: shelterDevice?.name,
                  } as Analytics;

                  analyticsMap.set(shelterDeviceId, analyticsEntry);
                }
              })
            );

            let filteredAnalytics = Array.from(analyticsMap.values());

            if (filters?.search) {
              filteredAnalytics = filteredAnalytics.filter((item) =>
                item
                  .shelterName!.toLowerCase()
                  .includes(filters.search!.toLowerCase())
              );
            }

            set({
              analytics: filteredAnalytics,
              totalData: Array.from(analyticsMap.values()).length,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            set({
              isLoading: false,
              error:
                error instanceof Error
                  ? error.message
                  : "An unknown error occurred",
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

  reset: () => {
    set({
      analytics: [],
      error: null,
      isLoading: false,
    });
  },

  cleanup: () => {
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
    }
    get().reset();
  },
}));
