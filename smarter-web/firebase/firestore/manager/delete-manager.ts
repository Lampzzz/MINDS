import { db } from "@/firebase/config";
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

export const deleteManagerById = async (id: string) => {
  try {
    await deleteDoc(doc(db, "managers", id));

    const q = query(collection(db, "members"), where("managerId", "==", id));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (docSnapshot) => {
      const memberDocRef = doc(db, "members", docSnapshot.id);
      await setDoc(
        memberDocRef,
        { managerId: null, updatedAt: Timestamp.now() },
        { merge: true }
      );
    });

    return { success: true, message: "Manager Deleted Successfully!" };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error.message };
  }
};
