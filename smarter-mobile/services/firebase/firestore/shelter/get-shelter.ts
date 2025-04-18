import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config";
import { Shelter } from "@/types";
import { getShelterDevice } from "./get-shelter-device";

export const getShelter = async (managerId: string) => {
  try {
    const shelterRef = collection(db, "shelters");
    const shelterQuery = query(shelterRef, where("managerId", "==", managerId));
    const shelterSnapshot = await getDocs(shelterQuery);

    if (shelterSnapshot.empty) {
      console.log("No shelter found for the assigned user.");
      return null;
    }

    const shelterData = shelterSnapshot.docs[0].data();
    const shelterDeviceData = await getShelterDevice(
      shelterData.shelterDeviceId
    );

    const data = {
      ...shelterData,
      id: shelterSnapshot.docs[0].id,
      name: shelterDeviceData?.name || null,
    } as Shelter;

    return data;
  } catch (error: any) {
    console.error("Get shelter: ", error.message);
    return null;
  }
};
