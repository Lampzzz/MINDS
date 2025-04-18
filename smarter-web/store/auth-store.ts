import { create } from "zustand";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";
import { Admin } from "@/types";
import { getAdminById } from "@/firebase/firestore/admin";

interface AuthState {
  currentUser: Admin | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isLoading: boolean;
  initializeAuthListener: () => () => void;
  fetchUserData: (id: string) => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  isEmailVerified: false,
  isLoading: true,

  initializeAuthListener: () => {
    set({ isLoading: true });

    const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        set({
          isAuthenticated: true,
          isLoading: false,
        });

        set({ isEmailVerified: userAuth.emailVerified });

        get().fetchUserData(userAuth.uid);
      } else {
        set({
          isAuthenticated: false,
          currentUser: null,
          isLoading: false,
        });
      }
    });

    return unsubscribe;
  },

  fetchUserData: async (id: string) => {
    const userData = await getAdminById(id);

    if (userData) {
      set({ currentUser: userData });
    } else {
      console.warn(`No user found with authId: ${id}`);
      set({ currentUser: null });
    }
  },
}));

export default useAuthStore;
