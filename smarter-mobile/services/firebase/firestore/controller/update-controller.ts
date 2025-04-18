import { db } from "../../config";
import {
  collection,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

export const updateInverter = async (
  value: string,
  shelterDeviceId: string
) => {
  try {
    const controllerQuery = query(
      collection(db, "controllers"),
      where("__name__", "==", "inverter"),
      where("shelterDeviceId", "==", shelterDeviceId)
    );

    const querySnapshot = await getDocs(controllerQuery);

    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, {
          status: value === "on" ? "off" : "on",
          timestamp: Timestamp.now(),
        });
      });
    } else {
      console.log("No matching inverter document found");
    }
  } catch (error) {
    console.error("Error updating inverter:", error);
  }
};

export const updateDoor = async (shelterDeviceId: string) => {
  try {
    const controllerQuery = query(
      collection(db, "controllers"),
      where("__name__", "==", "door"),
      where("shelterDeviceId", "==", shelterDeviceId)
    );

    const querySnapshot = await getDocs(controllerQuery);

    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, {
          status: "open",
          timestamp: Timestamp.now(),
        });
      });
    } else {
      console.log("No matching inverter document found");
    }
  } catch (error) {
    console.error("Error updating inverter:", error);
  }
};
