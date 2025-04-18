import { db } from "../../config";
import { doc, setDoc } from "firebase/firestore";
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

interface TemperatureData {
  residentId: string;
  bodyTemperature: number;
}

export const updateBodyTemperature = async (data: TemperatureData) => {
  try {
    const q = query(
      collection(db, "bodyTemperatures"),
      where("residentId", "==", data.residentId)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await setDoc(
        docRef,
        {
          ...data,
          timestamp: Timestamp.now(),
        },
        { merge: true }
      );
    } else {
      const newDocRef = doc(collection(db, "bodyTemperatures"));
      await setDoc(newDocRef, {
        ...data,
        timestamp: Timestamp.now(),
        residentId: data.residentId,
      });
    }
  } catch (error) {
    console.error("Error updating body temperature:", error);
  }
};
