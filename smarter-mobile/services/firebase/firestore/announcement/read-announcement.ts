import { Announcement } from "@/types";
import { db } from "../../config";
import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";

export const updateReadAnnouncement = async (
  announcementId: string,
  managerId: string
) => {
  try {
    const announcementRef = doc(db, "announcements", announcementId);
    const announcementSnapshot = await getDoc(announcementRef);

    const announcementData = announcementSnapshot.data() as Announcement;
    const currentReadBy = announcementData?.readBy || [];

    const updatedReadBy = currentReadBy.includes(managerId)
      ? currentReadBy
      : [...currentReadBy, managerId];

    await updateDoc(announcementRef, {
      readBy: updatedReadBy,
      updatedAt: Timestamp.now(),
    });
  } catch (error: any) {
    console.error("Read Announcement Error: ", error);
  }
};
