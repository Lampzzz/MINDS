import { db } from "@/firebase/config";
import { deleteDoc, doc } from "firebase/firestore";

export const deleteEmergencyById = async (id: string) => {
  try {
    await deleteDoc(doc(db, "reports", id));

    return { success: true, message: "Report Deleted Successfully!" };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error.message };
  }
};
