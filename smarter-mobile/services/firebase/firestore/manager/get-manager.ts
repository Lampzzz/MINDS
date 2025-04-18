import { doc, getDoc } from "@firebase/firestore";
import { db } from "../../config";
import { Manager } from "@/types";

export const getManager = async (id: string): Promise<Manager | null> => {
  try {
    const managerDoc = doc(db, "managers", id);
    const managerSnapshot = await getDoc(managerDoc);

    if (!managerSnapshot.exists()) {
      console.log("No manager found with the given ID.");
      return null;
    }

    return {
      id: managerSnapshot.id,
      ...managerSnapshot.data(),
    } as Manager;
  } catch (error) {
    console.error("Error fetching manager data:", error);
    return null;
  }
};
