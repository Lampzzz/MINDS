import { db } from "@/firebase/config";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { getManagerById } from "../manager";
import { Report, Manager, Shelter } from "@/types";
import { getShelterById } from "../shelter";
import { formatDisplayDate } from "@/lib/utils";

export const getEmergencies = async () => {
  try {
    const ReportRef = query(
      collection(db, "reports"),
      orderBy("createdAt", "desc")
    );

    const ReportData = await getDocs(ReportRef);

    const data = await Promise.all(
      ReportData.docs.map(async (doc) => {
        const managerData = (await getManagerById(
          doc.data().managerId
        )) as Manager;

        const shelterData = (await getShelterById(
          doc.data().shelterId
        )) as Shelter;

        return {
          id: doc.id,
          managerName: managerData.fullName,
          shelterName: shelterData.name,
          location: shelterData.location,
          createdAt: formatDisplayDate(doc.data().createdAt.seconds),
          ...doc.data(),
        };
      })
    );

    return data as Report[];
  } catch (error: any) {
    console.error("Error: ", error.message);
    return [];
  }
};
