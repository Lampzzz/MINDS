import { db } from "@/firebase/config";
import { deleteDoc, doc } from "firebase/firestore";

export const deleteAnnouncementById = async (id: string) => {
  try {
    await deleteDoc(doc(db, "announcements", id));

    return { success: true, message: "Announcement Deleted Successfully!" };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error.message };
  }
};
