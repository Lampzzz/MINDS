import { db } from "@/firebase/config";
import { Manager } from "@/types";
import { doc, getDoc } from "firebase/firestore";

export const getManagerById = async (id: string) => {
  try {
    const ref = doc(db, "managers", id);
    const docSnap = await getDoc(ref);

    if (!docSnap.exists()) return null;

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Manager;
  } catch (error) {
    console.error(error);
    return null;
  }
};
