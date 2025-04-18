import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config";
import { fireBaseError } from "@/lib/utils";
import { createAdmin } from "../firestore/admin";
import { login } from "./login";

interface Register {
  name: string;
  email: string;
  password: string;
}

export const register = async ({ name, email, password }: Register) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const userId = userCredential.user.uid;
    const idToken = await userCredential.user.getIdToken();

    await createAdmin({ name, email, id: userId });
    await login({ email, password, idToken });

    return { success: true, message: "Account Created Successfully!" };
  } catch (error: any) {
    const firebaseError = fireBaseError(error.code);

    if (Object.keys(firebaseError).length) {
      return { success: false, message: firebaseError };
    }

    return { success: false, message: error.message };
  }
};
