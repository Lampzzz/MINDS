import { create } from "zustand";
import { Member, MemberState, UserFilterTypes } from "@/types";
import { getMemberById } from "@/firebase/firestore/member";
import { db } from "@/firebase/config";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Unsubscribe } from "firebase/auth";
import { getManagerById } from "@/firebase/firestore/manager";
import { formatDisplayDate } from "@/lib/utils";

interface MemberStore extends MemberState {
  error: string | null;
  fetchMembers: (filters?: UserFilterTypes) => Promise<void>;
  fetchMember: (id: string) => Promise<void>;
  cleanup: () => void;
  resetMembers: () => void;
  unsubscribe?: Unsubscribe;
}

const useMemberStore = create<MemberStore>((set, get) => ({
  members: [],
  member: null,
  isLoading: false,
  totalData: 0,
  unsubscribe: undefined,
  error: null,

  async fetchMembers(filters?: UserFilterTypes) {
    get().cleanup();
    set({ isLoading: true, error: null });

    try {
      const membersQuery = query(
        collection(db, "members"),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(
        membersQuery,
        async (snapshot) => {
          try {
            const members = await Promise.all(
              snapshot.docs.map(async (doc) => {
                const manager = await getManagerById(doc.data().managerId);

                return {
                  ...doc.data(),
                  id: doc.id,
                  managerName: manager?.fullName,
                };
              })
            );

            let filteredMembers = members as Member[];

            if (filters) {
              const genderArray = filters.genders
                ? filters.genders.split(".")
                : [];

              if (genderArray.length > 0) {
                filteredMembers = filteredMembers.filter((member) =>
                  genderArray.includes(member.gender)
                );
              }

              if (filters.search) {
                filteredMembers = filteredMembers.filter((member) =>
                  member.fullName
                    .toLowerCase()
                    .includes(filters.search!.toLowerCase())
                );
              }
            }

            set({
              members: filteredMembers,
              totalData: members.length,
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

  fetchMember: async (id: string) => {
    try {
      const data = await getMemberById(id);

      if (data) {
        set({ member: data });
      }
    } catch (error) {
      console.error(error);
      set({ member: null });
    }
  },

  resetMembers: () => {
    set({
      members: [],
      error: null,
      isLoading: false,
    });
  },

  cleanup: () => {
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
    }
    get().resetMembers();
  },
}));

export default useMemberStore;
