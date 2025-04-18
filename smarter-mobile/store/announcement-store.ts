import { create } from "zustand";
import { Announcement } from "@/types";
import { db } from "@/services/firebase/config";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
} from "firebase/firestore";

interface AnnouncementState {
  announcements: Announcement[];
  isLoading: boolean;
  error: string | null;
  unsubscribe?: Unsubscribe;
  reset: () => void;
  cleanup: () => void;
  fetchAnnouncements: (callback?: any) => Promise<void>;
}

export const useAnnouncementStore = create<AnnouncementState>((set, get) => ({
  announcements: [],
  isLoading: false,
  error: null,

  fetchAnnouncements: async (callback) => {
    get().cleanup();
    set({ isLoading: true });
    let isFirstLoad = true;

    try {
      const announcementsQuery = query(
        collection(db, "announcements"),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(
        announcementsQuery,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Announcement[];

          if (callback) {
            const prevAnnouncements = get().announcements;

            const newAnnouncements = isFirstLoad
              ? []
              : data.filter(
                  (newItem) =>
                    !prevAnnouncements.some(
                      (prevItem) => prevItem.id === newItem.id
                    )
                );

            newAnnouncements.forEach((announcement) => {
              callback(announcement);
            });
          }

          set({
            announcements: data,
            isLoading: false,
            error: null,
          });

          isFirstLoad = false;
        },
        (error) => {
          set({
            error: error.message,
            isLoading: false,
          });
        }
      );

      set({ unsubscribe });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  reset: () => {
    set({
      announcements: [],
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
