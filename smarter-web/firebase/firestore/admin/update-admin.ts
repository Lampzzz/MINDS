import { Timestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { Admin } from "@/types";
import { auth, db } from "@/firebase/config";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

export const updateAdmin = async (data: Partial<Admin>, id: string) => {
  try {
    const ref = doc(db, "admins", id);
    const existingDoc = await getDoc(ref);
    const existingData = existingDoc.data();

    await setDoc(ref, {
      ...existingData,
      name: data.name || existingData?.name,
      updatedAt: Timestamp.now(),
    });

    return { success: true, message: "Account Updated Succesfully!" };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error.message };
  }
};

export const updateAccountPassword = async (
  email: string,
  currentPassword: string,
  newPassword: string
) => {
  try {
    const credential = EmailAuthProvider.credential(email, currentPassword);

    const reauthResult = await reauthenticateWithCredential(
      auth.currentUser!,
      credential
    );

    if (!reauthResult) {
      return { success: false, message: "Incorrect Current Password" };
    }

    await updatePassword(auth.currentUser!, newPassword);

    return { success: true, message: "Password Updated Succesfully!" };
  } catch (error: any) {
    console.error(error);

    if (error.code === "auth/invalid-credential") {
      return { success: false, message: "Incorrect current password" };
    }

    return { success: false, message: error.message };
  }
};
