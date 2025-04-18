import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Manager, Member } from "@/types";
import { db } from "@/firebase/config";
import { getManagerById } from "../manager";

export const getMembers = async () => {
  try {
    const q = query(collection(db, "members"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const data = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const manager = (await getManagerById(doc.data().managerId)) as Manager;

        return {
          id: doc.id,
          ...doc.data(),
          managerName: manager ? manager.fullName : "",
        };
      })
    );

    return data as Member[];
  } catch (error) {
    console.error(error);
    return [];
  }
};
