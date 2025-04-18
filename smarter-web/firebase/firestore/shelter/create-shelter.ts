import { Shelter } from "@/types";
import { db, storage } from "@/firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

export const createShelter = async (data: Shelter) => {
  try {
    const ref = collection(db, "shelters");
    const shelterImagesUrl =
      data.images!.length > 0 ? await uploadShelterImage(data.images!) : [];

    await addDoc(ref, {
      ...data,
      images: shelterImagesUrl,
      createdAt: Timestamp.now(),
    });

    await addDoc(collection(db, "analytics"), {
      shelterDeviceId: data.shelterDeviceId,
      shelterTemperature: 0,
      humidity: 0,
      airQuality: 0,
      batteryPercentage: 0,
      batteryRemainingUsageTime: "",
      createdAt: Timestamp.now(),
    });

    await setDoc(doc(db, "controllers", "door"), {
      shelterDeviceId: data.shelterDeviceId,
      status: "close",
      createdAt: Timestamp.now(),
    });

    await setDoc(doc(db, "controllers", "inverter"), {
      shelterDeviceId: data.shelterDeviceId,
      status: "off",
      createdAt: Timestamp.now(),
    });

    const cameraURL = await getCameraURL();

    await updateDoc(doc(db, "shelterDevices", data.shelterDeviceId), {
      cameraUrl: cameraURL,
      isRegistered: true,
    });

    return { success: true, message: "Shelter Created Successfully!" };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error.message };
  }
};

export const uploadShelterImage = async (
  images: File[]
): Promise<string[] | null> => {
  try {
    if (images.length === 0) return [];

    const data = await Promise.all(
      images.map(async (file) => {
        const storageRef = ref(storage, `shelters/${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
      })
    );

    return data;
  } catch (error: any) {
    console.error("Upload Image Error:", error);
    return null;
  }
};

export const getCameraURL = async () => {
  try {
    const docRef = collection(db, "ipcam");
    const q = query(docRef, orderBy("timestamp", "desc"), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No ip cam documents.");
      return null;
    }
    const latestDoc = querySnapshot.docs[0].data();

    return latestDoc.ip;
  } catch (error: any) {
    console.error("Get Camera URL Error:", error);
    return null;
  }
};
