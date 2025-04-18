import { db } from "@/firebase/config";
import { Report, Manager, Shelter } from "@/types";
import { getManagerById } from "@/firebase/firestore/manager";
import { getShelterById } from "@/firebase/firestore/shelter";
import { formatDisplayDate } from "@/lib/utils";
import { create } from "zustand";
import {
  Unsubscribe,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

export interface ReportFilter {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

interface ReportState {
  reports: Report[];
  totalData: number;
  isLoading: boolean;
  error: string | null;
  unsubscribe?: Unsubscribe;
  fetchReports: (filters?: ReportFilter) => Promise<void>;
  resetReports: () => void;
  cleanup: () => void;
}

export const useReportStore = create<ReportState>((set, get) => ({
  reports: [],
  totalData: 0,
  isLoading: false,
  error: null,
  unsubscribe: undefined,

  fetchReports: async (filters?: ReportFilter) => {
    get().cleanup();
    set({ isLoading: true, error: null });

    try {
      const reportsQuery = query(
        collection(db, "reports"),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(
        reportsQuery,
        async (snapshot) => {
          try {
            const data = await Promise.all(
              snapshot.docs.map(async (doc) => {
                const formattedDate = formatDisplayDate(doc.data().createdAt);
                const [managerData, shelterData] = await Promise.all([
                  getManagerById(doc.data().managerId) as Promise<Manager>,
                  getShelterById(doc.data().shelterId) as Promise<Shelter>,
                ]);

                return {
                  ...doc.data(),
                  id: doc.id,
                  managerName: managerData.fullName,
                  shelterName: shelterData.name,
                  location: shelterData.location,
                  createdAt: formattedDate,
                } as Report;
              })
            );

            let reports = data;

            if (filters) {
              const statusArray = filters.category
                ? filters.category.split(".")
                : [];

              if (statusArray.length > 0) {
                reports = reports.filter((item) =>
                  statusArray.includes(item.category.toLowerCase())
                );
              }

              if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                reports = reports.filter(
                  (report) =>
                    report.shelterName.toLowerCase().includes(searchTerm) ||
                    report.managerName.toLowerCase().includes(searchTerm)
                );
              }
            }

            set({
              reports,
              totalData: data.length,
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

  resetReports: () => {
    set({
      reports: [],
      error: null,
      isLoading: false,
    });
  },

  cleanup: () => {
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
    }
    get().resetReports();
  },
}));

export default useReportStore;
