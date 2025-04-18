import { create } from "zustand";
import { auth } from "@/services/firebase/config";
import { onAuthStateChanged } from "@firebase/auth";
import { ErrorHandler } from "@/lib/utils";
import { getManager } from "@/services/firebase/firestore/manager";
import { Manager } from "@/types";

interface AuthState {
  isLoading: boolean;
  currentUser: Manager | null;
}

interface AuthActions {
  fetchUser: (uid: string) => Promise<void>;
  initializeAuthListener: () => () => void;
  logout: () => Promise<void>;
  reset: () => void;
}

interface AuthStore extends AuthState, AuthActions {}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isLoading: false,
  currentUser: null,

  fetchUser: async (uid: string) => {
    try {
      set({ isLoading: true });
      const userData = await getManager(uid);

      set({
        currentUser: userData,
        isLoading: false,
      });
    } catch (error) {
      set({
        currentUser: null,
        isLoading: false,
      });
      ErrorHandler(error);
    }
  },

  initializeAuthListener: () => {
    set({ isLoading: true });

    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        await useAuthStore.getState().fetchUser(userAuth.uid);
      } else {
        useAuthStore.getState().reset();
      }
      set({ isLoading: false });
    });

    return unsubscribe;
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await auth.signOut();
      useAuthStore.getState().reset();
    } catch (error) {
      ErrorHandler(error);
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => {
    set({
      currentUser: null,
      isLoading: false,
    });
  },
}));
