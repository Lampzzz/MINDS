import { db } from "@/firebase/config";
import { ReleaseShelter } from "@/types";
import { Timestamp, addDoc, collection, doc, setDoc } from "firebase/firestore";

export const createReleaseShelter = async (data: Partial<ReleaseShelter>) => {
  try {
    const ref = collection(db, "releaseShelters");

    await addDoc(ref, {
      ...data,
      releaseDate: Timestamp.now(),
    });

    const shelterRef = doc(db, "shelters", data.shelterId!);

    await setDoc(
      shelterRef,
      {
        status: "occupied",
        managerId: data.releaseToId,
      },
      {
        merge: true,
      }
    );

    return { success: true, message: "Release Shelter Created Successfully!" };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error.message };
  }
};
