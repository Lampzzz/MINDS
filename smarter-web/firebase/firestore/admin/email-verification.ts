import { auth } from "@/firebase/config";
import { sendEmailVerification } from "firebase/auth";

export const emailVerification = async () => {
  try {
    await sendEmailVerification(auth.currentUser!);
  } catch (error) {
    console.error(error);
  }
};
