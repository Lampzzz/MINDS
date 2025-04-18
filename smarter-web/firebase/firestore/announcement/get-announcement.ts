import { doc, getDoc } from "firebase/firestore";
import { Announcement } from "@/types";
import { db } from "@/firebase/config";

export const getAnnouncement = async (announcementId: string) => {
  try {
    const ref = doc(db, "announcements", announcementId);
    const docSnap = await getDoc(ref);

    if (!docSnap.exists()) return null;

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Announcement;
  } catch (error) {
    console.error(error);
    return null;
  }
};
