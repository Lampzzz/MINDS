import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/config";
import { getAdminById } from "../admin";
import { getShelterById } from "../shelter";
import { getManagerById } from "../manager";
import { ReturnShelter } from "@/types";
import { format } from "date-fns";

export const getReturnShelters = async () => {
  try {
    const q = query(
      collection(db, "returnShelters"),
      orderBy("returnDate", "desc")
    );
    const querySnapshot = await getDocs(q);

    const data = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const admin = await getAdminById(doc.data().returnToId);
        const user = await getManagerById(doc.data().returnById);
        const shelter = await getShelterById(doc.data().shelterId);

        const { returnDate, ...data } = doc.data();
        const date = new Date(returnDate.seconds * 1000);

        return {
          id: doc.id,
          adminName: admin?.name,
          shelterName: shelter?.name,
          managerName: user?.fullName,
          returnDate: format(date, "MMMM d, yyyy 'at' h:mm a"),
          ...data,
        };
      })
    );

    return data as ReturnShelter[];
  } catch (error) {
    console.error(error);
    return [];
  }
};
