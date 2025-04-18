import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Shelter } from "@/types";
import { db } from "@/firebase/config";
import { getShelterDevice } from "./get-shelter-device";

export const getShelterById = async (id: string) => {
  try {
    const ref = doc(db, "shelters", id);
    const docSnap = await getDoc(ref);

    if (!docSnap.exists()) return null;

    const shelterDeviceData = await getShelterDevice(
      docSnap.data().shelterDeviceId
    );

    return {
      id: docSnap.id,
      ...docSnap.data(),
      name: shelterDeviceData?.name,
    } as Shelter;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getShelterByManagerId = async (id: string) => {
  try {
    const ref = query(collection(db, "shelters"), where("managerId", "==", id));
    const querySnapshot = await getDocs(ref);

    if (querySnapshot.empty) return null;

    const docSnap = querySnapshot.docs[0];

    const shelterDeviceData = await getShelterDevice(
      docSnap.data().shelterDeviceId
    );

    return {
      id: docSnap.id,
      name: shelterDeviceData?.name,
      ...docSnap.data(),
    } as Shelter;
  } catch (error) {
    console.error(error);
    return null;
  }
};
