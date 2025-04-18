import { signOut } from "@firebase/auth";
import { auth } from "../config";
import { router } from "expo-router";

export const logout = async () => {
  try {
    await signOut(auth);
    router.replace("/login");
  } catch (error) {
    console.error(error);
  }
};
