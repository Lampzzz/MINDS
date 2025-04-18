import { create } from "zustand";
import { ReleaseShelter } from "@/types";
import { db } from "@/firebase/config";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
  Timestamp,
} from "firebase/firestore";
import { format } from "date-fns";
import { getAdminById } from "@/firebase/firestore/admin";
import { getShelterById } from "@/firebase/firestore/shelter";
import { getManagerById } from "@/firebase/firestore/manager";

interface ReleaseShelterState {
  releaseShelters: ReleaseShelter[];
  totalData: number;
  isLoading: boolean;
  error: string | null;
  unsubscribe?: Unsubscribe;
  fetchReleaseShelters: (filters?: ReleaseShelterFilterTypes) => Promise<void>;
  cleanup: () => void;
  resetReleaseShelters: () => void;
}

export interface ReleaseShelterFilterTypes {
  page?: number;
  limit?: number;
  search?: string;
}

const useReleaseShelterStore = create<ReleaseShelterState>((set, get) => ({
  releaseShelters: [],
  totalData: 0,
  isLoading: false,
  error: null,
  unsubscribe: undefined,

  async fetchReleaseShelters(filters?: ReleaseShelterFilterTypes) {
    get().cleanup();
    set({ isLoading: true, error: null });

    try {
      const releaseSheltersQuery = query(
        collection(db, "releaseShelters"),
        orderBy("releaseDate", "desc")
      );

      const unsubscribe = onSnapshot(
        releaseSheltersQuery,
        async (snapshot) => {
          try {
            const releaseShelters = await Promise.all(
              snapshot.docs.map(async (doc) => {
                const [admin, shelter, manager] = await Promise.all([
                  getAdminById(doc.data().releaseById),
                  getShelterById(doc.data().shelterId),
                  getManagerById(doc.data().releaseToId),
                ]);

                const { releaseDate, ...data } = doc.data();
                const date = new Date(releaseDate.seconds * 1000);

                return {
                  id: doc.id,
                  ...data,
                  adminName: admin?.name,
                  shelterName: shelter?.name,
                  shelterLocation: shelter?.location,
                  managerName: manager?.fullName,
                  releaseDate: format(date, "MMMM d, yyyy 'at' h:mm a"),
                } as ReleaseShelter;
              })
            );

            let filteredShelters = releaseShelters;

            if (filters?.search) {
              filteredShelters = filteredShelters.filter((shelter) => {
                const { adminName, shelterName, managerName } = shelter;
                return (
                  adminName
                    .toLowerCase()
                    .includes(filters.search!.toLowerCase()) ||
                  shelterName
                    .toLowerCase()
                    .includes(filters.search!.toLowerCase()) ||
                  managerName
                    .toLowerCase()
                    .includes(filters.search!.toLowerCase())
                );
              });
            }

            set({
              releaseShelters: filteredShelters,
              totalData: releaseShelters.length,
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

  resetReleaseShelters: () => {
    set({
      releaseShelters: [],
      error: null,
      isLoading: false,
    });
  },

  cleanup: () => {
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
    }
    get().resetReleaseShelters();
  },
}));

export default useReleaseShelterStore;
