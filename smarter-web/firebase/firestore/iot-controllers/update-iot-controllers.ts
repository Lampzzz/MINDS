import { db } from "@/firebase/config";
import {
  collection,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";

export const updateInverterController = async (
  shelterDeviceId: string,
  data: string
) => {
  try {
    const q = query(
      collection(db, "controllers"),
      where("__name__", "==", "inverter"),
      where("shelterDeviceId", "==", shelterDeviceId)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error(
        `No inverter document found for shelterDeviceId: ${shelterDeviceId}`
      );
      return;
    }

    const controllerRef = querySnapshot.docs[0].ref;

    await setDoc(
      controllerRef,
      {
        status: data === "on" ? "off" : "on",
        timestamp: Timestamp.now(),
      },
      { merge: true }
    );
  } catch (error: any) {
    console.error("Error updating inverter:", error.message);
    return;
  }
};

export const updateDoorController = async (shelterDeviceId: string) => {
  try {
    const q = query(
      collection(db, "controllers"),
      where("__name__", "==", "door"),
      where("shelterDeviceId", "==", shelterDeviceId)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error(
        `No door document found for shelterDeviceId: ${shelterDeviceId}`
      );
      return;
    }

    const controllerRef = querySnapshot.docs[0].ref;

    await setDoc(
      controllerRef,
      {
        status: "open",
        timestamp: Timestamp.now(),
      },
      { merge: true }
    );

    console.log("Door Function");
  } catch (error: any) {
    console.error("Error updating door:", error.message);
    return;
  }
};
