import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../config";
import { Announcement } from "@/types";

export const getAnnouncements = async () => {
  try {
    const q = query(
      collection(db, "announcements"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No announcements found.");
      return [];
    }

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Announcement[];
  } catch (error) {
    console.error(error);
    return [];
  }
};
