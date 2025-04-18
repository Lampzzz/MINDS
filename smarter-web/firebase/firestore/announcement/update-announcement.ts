import { db } from "@/firebase/config";
import { Announcement } from "@/types";
import { doc, Timestamp, updateDoc } from "firebase/firestore";

export const updateAnnouncement = async (data: Announcement) => {
  try {
    const announcementDoc = doc(db, "announcements", data.id!);

    await updateDoc(announcementDoc, {
      ...data,
      updatedAt: Timestamp.now(),
    });

    return { success: true, message: "Announcement Updated Successfully!" };
  } catch (error: any) {
    console.error("Error: ", error.message);
    return { success: false, message: error.message };
  }
};
