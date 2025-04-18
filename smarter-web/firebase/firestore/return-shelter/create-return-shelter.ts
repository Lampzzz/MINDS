import { db } from "@/firebase/config";
import { ReturnShelter } from "@/types";
import { getShelterByManagerId } from "../shelter";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

export const createReturnShelter = async (data: Partial<ReturnShelter>) => {
  try {
    const ref = collection(db, "returnShelters");
    const shelterData = await getShelterByManagerId(data.returnById!);

    await addDoc(ref, {
      ...data,
      shelterId: shelterData?.id!,
      returnDate: Timestamp.now(),
    });

    const shelterRef = doc(db, "shelters", shelterData?.id!);
    const existingDoc = await getDoc(shelterRef);

    await setDoc(shelterRef, {
      ...existingDoc.data(),
      status: "available",
      managerId: null,
      updatedAt: Timestamp.now(),
    });

    return { success: true, message: "Return Shelter Created Successfully!" };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error.message };
  }
};
