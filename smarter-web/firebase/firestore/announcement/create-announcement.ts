import { addDoc, collection, Timestamp } from "firebase/firestore";
import { Announcement } from "@/types";
import { db } from "@/firebase/config";

export const createAnnouncement = async (data: Announcement) => {
  try {
    const ref = collection(db, "announcements");

    await addDoc(ref, {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return { success: true, message: "Announcement Created Successfully!" };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error.message };
  }
};
