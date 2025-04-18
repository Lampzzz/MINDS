import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/config";
import { getShelterDevice } from "./get-shelter-device";
import { Shelter } from "@/types";

export const getShelters = async () => {
  try {
    const q = query(collection(db, "shelters"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const data = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const shelterDevice = await getShelterDevice(
          doc.data().shelterDeviceId
        );

        return {
          id: doc.id,
          ...doc.data(),
          name: shelterDevice?.name ?? "",
        };
      })
    );

    return data as Shelter[];
  } catch (error) {
    console.error(error);
    return [];
  }
};
