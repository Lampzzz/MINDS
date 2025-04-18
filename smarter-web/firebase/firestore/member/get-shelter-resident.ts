import { db } from "@/firebase/config";
import { Manager, Member } from "@/types";
import { collection, getDocs, where, query } from "firebase/firestore";
import { getManagerById } from "../manager";

export const getShelterResident = async (managerId: string | null) => {
  try {
    if (!managerId) {
      return [];
    }

    const [manager, members] = await Promise.all([
      getManagerById(managerId),
      getMemberByManagerId(managerId),
    ]);

    if (!manager) {
      return [];
    }

    return [manager, ...members] as (Manager & Member)[];
  } catch (error) {
    console.error("Error fetching shelter residents:", error);
    return [];
  }
};

export const getMemberByManagerId = async (id: string) => {
  try {
    const ref = query(collection(db, "members"), where("managerId", "==", id));
    const docSnap = await getDocs(ref);

    const members = docSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return members as Member[];
  } catch (error) {
    console.error(error);
    return [];
  }
};
