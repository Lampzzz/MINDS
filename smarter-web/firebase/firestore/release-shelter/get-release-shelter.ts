import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/config";
import { getAdminById } from "../admin";
import { getShelterById } from "../shelter";
import { getManagerById } from "../manager";
import { ReleaseShelter } from "@/types";
import { format } from "date-fns";

export const getReleaseShelters = async () => {
  try {
    const q = query(
      collection(db, "releaseShelters"),
      orderBy("releaseDate", "desc")
    );
    const querySnapshot = await getDocs(q);

    const data = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const admin = await getAdminById(doc.data().releaseById);
        const shelter = await getShelterById(doc.data().shelterId);
        const user = await getManagerById(doc.data().releaseToId);

        const { releaseDate, ...data } = doc.data();
        const date = new Date(releaseDate.seconds * 1000);

        return {
          id: doc.id,
          adminName: admin?.name,
          shelterName: shelter?.name,
          managerName: user?.fullName,
          releaseDate: format(date, "MMMM d, yyyy 'at' h:mm a"),
          ...data,
        };
      })
    );

    return data as ReleaseShelter[];
  } catch (error) {
    console.error(error);
    return [];
  }
};
