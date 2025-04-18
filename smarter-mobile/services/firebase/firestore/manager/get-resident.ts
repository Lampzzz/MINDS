import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config";
import { Member } from "@/types";

export const getResident = async (id: string) => {
  try {
    const memberRef = query(
      collection(db, "members"),
      where("managerId", "==", id)
    );

    const membersData = await getDocs(memberRef);

    if (membersData.empty) return [];

    return membersData.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Member[];
  } catch (error: any) {
    console.error(error);
    return [];
  }
};
