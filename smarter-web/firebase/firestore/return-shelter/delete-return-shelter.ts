import { db } from "@/firebase/config";
import { deleteDoc, doc } from "firebase/firestore";

export const deleteReturnShelter = async (id: string) => {
  try {
    await deleteDoc(doc(db, "returnShelters", id));

    return { success: true, message: "Return Shelter Deleted Successfully!" };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error.message };
  }
};
