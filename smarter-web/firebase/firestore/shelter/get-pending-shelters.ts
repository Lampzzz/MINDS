import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import { ShelterDevice } from "@/types";

export const getPendingShelters = async (value: boolean = false) => {
  try {
    const q = query(
      collection(db, "shelterDevices"),
      where("isRegistered", "==", value)
    );

    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((data) => {
      const shelterNo = data.data().shelterNo;

      return {
        id: data.id,
        ...data.data(),
        name: `Shelter ${String(shelterNo).padStart(2, "0")}`,
      };
    });

    return data as ShelterDevice[];
  } catch (error) {
    console.error(error);
    return [];
  }
};
