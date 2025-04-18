import { deleteDoc, doc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { auth, db } from "@/firebase/config";

export const deleteAdminById = async (id: string) => {
  try {
    await deleteDoc(doc(db, "admins", id));
    await deleteUser(auth.currentUser!);
    return { success: true, message: "Account Deleted Succesfully!" };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error.message };
  }
};
