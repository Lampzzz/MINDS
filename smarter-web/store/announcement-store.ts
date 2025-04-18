import { create } from "zustand";
import { db } from "@/firebase/config";
import { Announcement, Admin, BaseFilterTypes } from "@/types";
import { formatDisplayDate } from "@/lib/utils";
import { getAdminById } from "@/firebase/firestore/admin";
import { getManagerById } from "@/firebase/firestore/manager";
import { getAnnouncement } from "@/firebase/firestore/announcement";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
} from "firebase/firestore";

interface AnnouncementFilterTypes extends Partial<BaseFilterTypes> {
  category?: string;
}

interface AnnouncementState {
  announcements: Announcement[];
  announcement: Announcement | null;
  totalData: number;
  isLoading: boolean;
  error: string | null;
  unsubscribe?: Unsubscribe;
  fetchAnnouncement: (id: string) => Promise<void>;
  fetchAnnouncements: (filters?: AnnouncementFilterTypes) => Promise<void>;
  resetAnnouncements: () => void;
  cleanup: () => void;
}

export const useAnnouncementStore = create<AnnouncementState>((set, get) => ({
  announcements: [],
  announcement: null,
  totalData: 0,
  isLoading: false,
  error: null,
  unsubscribe: undefined,

  async fetchAnnouncements(filters?: AnnouncementFilterTypes) {
    get().cleanup();
    set({ isLoading: true, error: null });

    try {
      const announcementsQuery = query(
        collection(db, "announcements"),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(
        announcementsQuery,
        async (snapshot) => {
          try {
            const data = await Promise.all(
              snapshot.docs.map(async (doc) => {
                const [announcementData, sender] = await Promise.all([
                  doc.data() as Announcement,
                  getAdminById(doc.data().senderId) as Promise<Admin>,
                ]);

                let recipient = "all";
                if (announcementData.recipient !== "all") {
                  const manager = await getManagerById(
                    announcementData.recipient!
                  );
                  recipient = manager?.fullName || "Unknown";
                }

                return {
                  ...announcementData,
                  id: doc.id,
                  createdAt: formatDisplayDate(announcementData.createdAt),
                  senderName: sender.name,
                  recipient,
                };
              })
            );

            let announcements = data;

            if (filters) {
              const categoryArray = filters.category
                ? filters.category.split(".")
                : [];

              if (categoryArray.length > 0) {
                announcements = announcements.filter((item) =>
                  categoryArray.includes(item.category)
                );
              }

              if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                announcements = announcements.filter((announcement) =>
                  announcement.title.toLowerCase().includes(searchTerm)
                );
              }
            }

            set({
              announcements,
              totalData: data.length,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Error processing announcements",
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

  fetchAnnouncement: async (id: string) => {
    try {
      const data = await getAnnouncement(id);

      if (data) {
        set({ announcement: data });
      }
    } catch (error) {
      console.error(error);
      set({ announcement: null });
    }
  },

  resetAnnouncements() {
    set({
      announcements: [],
      totalData: 0,
      isLoading: false,
      error: null,
    });
  },

  cleanup() {
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
    }
    get().resetAnnouncements();
  },
}));

export default useAnnouncementStore;
