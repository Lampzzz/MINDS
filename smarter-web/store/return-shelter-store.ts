import { create } from "zustand";
import { ReturnShelter } from "@/types";
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

interface ReturnShelterState {
  returnShelters: ReturnShelter[];
  totalData: number;
  isLoading: boolean;
  error: string | null;
  unsubscribe?: Unsubscribe;
  fetchReturnShelters: (filters?: ReturnShelterFilterTypes) => Promise<void>;
  cleanup: () => void;
  resetReturnShelters: () => void;
}

export interface ReturnShelterFilterTypes {
  page?: number;
  limit?: number;
  search?: string;
}

const useReturnShelterStore = create<ReturnShelterState>((set, get) => ({
  returnShelters: [],
  totalData: 0,
  isLoading: false,
  error: null,
  unsubscribe: undefined,

  async fetchReturnShelters(filters?: ReturnShelterFilterTypes) {
    get().cleanup();
    set({ isLoading: true, error: null });

    try {
      const returnSheltersQuery = query(
        collection(db, "returnShelters"),
        orderBy("returnDate", "desc")
      );

      const unsubscribe = onSnapshot(
        returnSheltersQuery,
        async (snapshot) => {
          try {
            const returnShelters = await Promise.all(
              snapshot.docs.map(async (doc) => {
                const [admin, manager, shelter] = await Promise.all([
                  getAdminById(doc.data().returnToId),
                  getManagerById(doc.data().returnById),
                  getShelterById(doc.data().shelterId),
                ]);

                const { returnDate, ...data } = doc.data();
                const date = new Date(returnDate.seconds * 1000);

                return {
                  id: doc.id,
                  ...data,
                  adminName: admin?.name,
                  shelterName: shelter?.name,
                  shelterLocation: shelter?.location,
                  managerName: manager?.fullName,
                  returnDate: format(date, "MMMM d, yyyy 'at' h:mm a"),
                } as ReturnShelter;
              })
            );

            let filteredShelters = returnShelters;

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
              returnShelters: filteredShelters,
              totalData: returnShelters.length,
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

  resetReturnShelters: () => {
    set({
      returnShelters: [],
      error: null,
      isLoading: false,
    });
  },

  cleanup: () => {
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
    }
    get().resetReturnShelters();
  },
}));

export default useReturnShelterStore;
