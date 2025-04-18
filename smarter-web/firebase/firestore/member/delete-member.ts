import { db } from "@/firebase/config";
import { deleteDoc, doc } from "firebase/firestore";

export const deleteMemberById = async (id: string) => {
  try {
    await deleteDoc(doc(db, "members", id));

    return { success: true, message: "Member Deleted Successfully!" };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error };
  }
};
