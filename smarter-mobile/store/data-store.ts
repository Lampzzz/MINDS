import { create } from "zustand";

interface DataState<T> {
  data: T[];
  latest: T | null;
  isLoading: boolean;
  error: string | null;
  unsubscribe?: () => void;
  fetchData: (id: string) => Promise<void>;
  reset: () => void;
  cleanup: () => void;
}

type FetchFunction<T> = (
  id: string,
  onData: (data: T[]) => void,
  onError: (error: Error) => void
) => () => void;

export const dataStore = <T>(fetchFn: FetchFunction<T>) =>
  create<DataState<T>>((set, get) => ({
    data: [],
    latest: null,
    isLoading: false,
    error: null,
    unsubscribe: undefined,

    fetchData: async (id: string) => {
      if (!id) {
        set({ error: "No ID provided" });
        return;
      }

      get().cleanup();
      set({ isLoading: true, error: null });

      try {
        const unsubscribe = fetchFn(
          id,
          (data) => {
            set({
              data,
              latest: data[0] || null,
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

    reset: () => {
      set({
        data: [],
        latest: null,
        isLoading: false,
        error: null,
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
