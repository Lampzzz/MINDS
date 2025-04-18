import { Shelter } from "@/types";
import { db, storage } from "@/firebase/config";
import { getCameraURL } from "./create-shelter";
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

export const updateShelter = async (
  data: Shelter,
  shelterId: string,
  currentShelterDeviceId?: string
) => {
  const { id, shelterDeviceId, name, ...rest } = data;

  try {
    const ref = doc(db, "shelters", shelterId);

    const shelterImages = await updateShelterImage(shelterId, data.images);

    if (data.shelterDeviceId && currentShelterDeviceId) {
      const currentShelterDeviceRef = doc(
        db,
        "shelterDevices",
        currentShelterDeviceId
      );

      const newShelterDeviceRef = doc(
        db,
        "shelterDevices",
        data.shelterDeviceId
      );

      const cameraURL = await getCameraURL();

      await updateDoc(currentShelterDeviceRef, {
        cameraUrl: null,
        isRegistered: false,
      });

      await updateDoc(newShelterDeviceRef, {
        isRegistered: true,
        cameraUrl: cameraURL,
      });

      const analyticsQuery = query(
        collection(db, "analytics"),
        where("shelterDeviceId", "==", currentShelterDeviceId),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      const analyticsSnapshot = await getDocs(analyticsQuery);

      if (analyticsSnapshot.empty) {
        return { success: false, message: "No analytics found" };
      }

      const latestAnalyticsDoc = analyticsSnapshot.docs[0];

      const analyticsDocRef = doc(db, "analytics", latestAnalyticsDoc.id);

      await updateDoc(analyticsDocRef, {
        shelterDeviceId: data.shelterDeviceId,
        updatedAt: Timestamp.now(),
      });
    }

    await setDoc(
      ref,
      {
        ...rest,
        images: shelterImages,
        shelterDeviceId: data.shelterDeviceId
          ? data.shelterDeviceId
          : currentShelterDeviceId,
      },
      { merge: true }
    );

    return { success: true, message: "Shelter Updated Successfully!" };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error.message };
  }
};

type ShelterImage = File | string;

export const updateShelterImage = async (
  shelterId: string,
  images: ShelterImage[] = []
) => {
  try {
    const shelterDocRef = doc(db, "shelters", shelterId);
    const shelterDoc = await getDoc(shelterDocRef);

    if (!shelterDoc.exists()) {
      return { success: false, message: "Shelter not found" };
    }

    const currentShelterData = shelterDoc.data();
    const currentImages = currentShelterData.images || [];
    const processedImages: string[] = [];
    const imagesToKeep = new Set<string>();

    for (const image of images) {
      if (typeof image === "string") {
        processedImages.push(image);
        imagesToKeep.add(image);
      } else if (image instanceof File) {
        const imageRef = ref(storage, `shelters/${Date.now()}-${image.name}`);
        const snapshot = await uploadBytes(imageRef, image);
        const downloadURL = await getDownloadURL(snapshot.ref);
        processedImages.push(downloadURL);
      }
    }

    for (const oldImageUrl of currentImages) {
      if (!imagesToKeep.has(oldImageUrl)) {
        try {
          const imageRef = ref(storage, oldImageUrl);
          await deleteObject(imageRef);
          console.log(`Deleted image: ${oldImageUrl}`);
        } catch (error) {
          console.error(`Error deleting image ${oldImageUrl}:`, error);
        }
      }
    }

    return processedImages;
  } catch (error: any) {
    console.error("Error in updateShelterImage:", error);
    return [];
  }
};
