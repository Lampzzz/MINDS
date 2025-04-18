import { doc, getDoc } from "@firebase/firestore";
import { db } from "../../config";
import { ShelterDevice } from "@/types";

export const getShelterDevice = async (
  id: string
): Promise<ShelterDevice | null> => {
  try {
    const shelterDeviceRef = doc(db, "shelterDevices", id);
    const shelterDeviceSnap = await getDoc(shelterDeviceRef);

    if (!shelterDeviceSnap.exists()) {
      console.log("No shelter device found with the given ID.");
      return null;
    }

    const shelterDeviceData = shelterDeviceSnap.data();

    return {
      id: shelterDeviceSnap.id,
      ...shelterDeviceData,
      name: `Shelter ${String(shelterDeviceData?.shelterNo).padStart(2, "0")}`,
    } as ShelterDevice;
  } catch (error) {
    console.error("Error fetching shelter device data:", error);
    return null;
  }
};
