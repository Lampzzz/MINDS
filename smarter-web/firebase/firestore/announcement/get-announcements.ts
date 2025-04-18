import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Admin, Announcement } from "@/types";
import { db } from "@/firebase/config";
import { getManagerById } from "../manager";
import { getAdminById } from "../admin";
import { format } from "date-fns";

export const getAnnouncements = async () => {
  try {
    const q = query(
      collection(db, "announcements"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    const data = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const sender = (await getAdminById(doc.data().senderId)) as Admin;

        const recipientId = doc.data().recipient;

        let recipient;
        if (recipientId !== "all") {
          const manager = await getManagerById(recipientId);
          recipient = manager?.fullName;
        } else {
          recipient = "all";
        }

        const date = new Date(doc.data().createdAt.seconds * 1000);

        return {
          id: doc.id,
          ...doc.data(),
          senderName: sender ? sender.name : null,
          createdAt: format(date, "MMMM d, yyyy 'at' h:mm a"),
          recipient: recipient,
        };
      })
    );

    return data as Announcement[];
  } catch (error) {
    console.error(error);
    return [];
  }
};
