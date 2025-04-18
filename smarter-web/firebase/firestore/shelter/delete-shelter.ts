import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export const deleteShelterById = async (
  shelterId: string,
  shelterDeviceId: string
) => {
  try {
    await deleteDoc(doc(db, "shelters", shelterId));

    await updateDoc(doc(db, "shelterDevices", shelterDeviceId), {
      isRegistered: false,
    });

    return { success: true, message: "Shelter Deleted Successfully!" };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error.message };
  }
};
