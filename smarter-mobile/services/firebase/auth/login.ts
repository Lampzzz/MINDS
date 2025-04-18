import { signInWithEmailAndPassword } from "@firebase/auth";
import { auth, db } from "../config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getShelter } from "../firestore/shelter";

export const login = async (email: string, password: string) => {
  try {
    const managerRef = query(
      collection(db, "managers"),
      where("email", "==", email)
    );
    const managerSnapshot = await getDocs(managerRef);

    if (managerSnapshot.empty) {
      return { success: false, message: "Email does not exist" };
    }

    const user = await signInWithEmailAndPassword(auth, email, password);

    const shelter = await getShelter(user.user.uid);

    if (!shelter) {
      return {
        success: false,
        message: "No shelter found for the assigned user",
      };
    }

    return { success: true, message: "Login Successfully!" };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error.message };
  }
};
