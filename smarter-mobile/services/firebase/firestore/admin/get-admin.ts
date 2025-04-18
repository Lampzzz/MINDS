import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config";
import { Admin } from "@/types";

export const getAdmin = async (authId: string) => {
  try {
    const adminRef = collection(db, "admins");
    const adminQuery = query(adminRef, where("authId", "==", authId));
    const adminSnapshot = await getDocs(adminQuery);

    if (adminSnapshot.empty) {
      console.log("No admin found with the given ID.");
      return null;
    }

    const adminData = adminSnapshot.docs[0].data();

    return {
      id: adminSnapshot.docs[0].id,
      ...adminData,
    } as Admin;
  } catch (error: any) {
    console.error(error.message);
  }
};
