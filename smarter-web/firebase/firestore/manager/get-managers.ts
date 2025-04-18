import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Manager } from "@/types";
import { db } from "@/firebase/config";

export const getManagers = async () => {
  try {
    const q = query(collection(db, "managers"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    return data as Manager[];
  } catch (error) {
    console.error(error);
    return [];
  }
};
