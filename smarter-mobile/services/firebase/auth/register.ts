import { addDoc, collection } from "@firebase/firestore";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { User } from "@/types";
import { auth, db } from "../config";

export const register = async (data: User) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.contactInfo,
      data.password
    );

    const { password, photo, ...userData } = data;

    await addDoc(collection(db, "users"), {
      auth_id: userCredential.user.uid,
      ...userData,
    });

    // await login(data.contactInfo, data.password);
  } catch (error: any) {
    console.error(error);
  }
};
