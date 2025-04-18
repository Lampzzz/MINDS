import { getDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { ShelterDevice } from "@/types";

export const getShelterDevice = async (shelterId: string) => {
  try {
    const ref = doc(db, "shelterDevices", shelterId);
    const querySnapshot = await getDoc(ref);

    if (!querySnapshot.exists()) {
      return null;
    }

    const shelterNo = querySnapshot.data().shelterNo || 0;

    const data = {
      ...querySnapshot.data(),
      id: querySnapshot.id,
      name: `Shelter ${String(shelterNo).padStart(2, "0")}`,
    };

    return data as ShelterDevice;
  } catch (error) {
    console.error(error);
    return null;
  }
};
