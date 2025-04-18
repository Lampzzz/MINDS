import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../config";
import { collection, getDocs, query, where } from "firebase/firestore";

export const forgotPassword = async (email: string) => {
  try {
    const q = query(collection(db, "admins"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, message: "Email does not exist" };
    }

    await sendPasswordResetEmail(auth, email);
    return { success: true, message: "Password reset link sent to your email" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
