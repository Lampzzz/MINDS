import { db } from "@/firebase/config";
import { deleteDoc, doc } from "firebase/firestore";

export const deleteReleaseShelter = async (id: string) => {
  try {
    await deleteDoc(doc(db, "releaseShelters", id));

    return { success: true, message: "Release Shelter Deleted Successfully!" };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error.message };
  }
};
