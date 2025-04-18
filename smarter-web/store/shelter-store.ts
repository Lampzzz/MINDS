import { create } from "zustand";
import { db } from "@/firebase/config";
import { Shelter, ShelterDevice, ShelterFilterTypes } from "@/types";
import { getShelterDevice } from "@/firebase/firestore/shelter";
import {
  getShelterById,
  getPendingShelters,
} from "@/firebase/firestore/shelter";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
} from "firebase/firestore";

interface ShelterState {
  shelters: Shelter[] | null;
  shelterDevices: ShelterDevice[] | null;
  shelter: Shelter | null;
  totalData: number;
  isLoading: boolean;
  error: string | null;
  fetchShelters: (filters?: ShelterFilterTypes) => Promise<void>;
  fetchShelter: (id: string) => Promise<void>;
  fetchShelterDevices: () => Promise<void>;
  unsubscribe?: Unsubscribe;
  cleanup: () => void;
  reset: () => void;
}

const useShelterStore = create<ShelterState>((set, get) => ({
  shelters: [],
  totalData: 0,
  shelter: null,
  isLoading: false,
  shelterDevices: [],
  error: null,
  unsubscribe: undefined,

  async fetchShelters(filters?: ShelterFilterTypes) {
    get().cleanup();
    set({ isLoading: true, error: null });

    try {
      const sheltersQuery = query(
        collection(db, "shelters"),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(
        sheltersQuery,
        async (snapshot) => {
          try {
            const shelters = await Promise.all(
              snapshot.docs.map(async (doc) => {
                const shelterDevice = await getShelterDevice(
                  doc.data().shelterDeviceId
                );

                return {
                  ...doc.data(),
                  id: doc.id,
                  name: shelterDevice?.name,
                  cameraUrl: shelterDevice?.cameraUrl,
                } as unknown as Shelter;
              })
            );

            let filteredShelters = shelters;

            if (filters) {
              const statusArray = filters.status
                ? filters.status.split(".")
                : [];
              const locationArray = filters.location
                ? filters.location.split(".")
                : [];

              if (statusArray.length > 0) {
                filteredShelters = filteredShelters.filter((shelter) =>
                  statusArray.includes(shelter.status)
                );
              }

              if (locationArray.length > 0) {
                filteredShelters = filteredShelters.filter((shelter) =>
                  locationArray.includes(shelter.location.toLowerCase())
                );
              }

              if (filters.search) {
                filteredShelters = filteredShelters.filter((shelter) =>
                  shelter
                    .name!.toLowerCase()
                    .includes(filters.search!.toLowerCase())
                );
              }
            }

            set({
              shelters: filteredShelters,
              totalData: shelters.length,
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

  fetchShelter: async (id: string) => {
    try {
      const data = await getShelterById(id);

      if (data) {
        set({ shelter: data });
      }
    } catch (error) {
      console.error(error);
      set({ shelter: null });
    }
  },

  fetchShelterDevices: async () => {
    const data = await getPendingShelters();
    set({ shelterDevices: data });
  },

  reset: () => {
    set({
      shelters: [],
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

export default useShelterStore;
