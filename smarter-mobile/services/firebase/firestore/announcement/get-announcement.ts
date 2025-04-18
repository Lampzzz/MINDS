import { Announcement } from "@/types";
import { db } from "../../config";
import { doc, getDoc } from "firebase/firestore";
import { getAdmin } from "../admin/get-admin";

export const getAnnouncement = async (announcementId: string) => {
  try {
    const announcementRef = doc(db, "announcements", announcementId);
    const announcementSnapshot = await getDoc(announcementRef);
    const admin = await getAdmin(announcementSnapshot.data()!.senderId);

    if (!announcementSnapshot.exists()) {
      console.log("There is no announcement in the given ID");
      return null;
    }

    return {
      id: announcementSnapshot.id,
      ...announcementSnapshot.data(),
      senderName: admin?.name,
    } as Announcement;
  } catch (error: any) {
    console.error("Get Announcement Erro: ", error);
    return null;
  }
};
