import { db } from "@/firebase/config";
import { Member } from "@/types";
import { doc, getDoc } from "firebase/firestore";

export const getMemberById = async (id: string) => {
  try {
    const ref = doc(db, "members", id);
    const docSnap = await getDoc(ref);

    if (!docSnap.exists()) return null;

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Member;
  } catch (error) {
    console.error(error);
    return null;
  }
};
