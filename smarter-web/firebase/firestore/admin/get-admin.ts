import { doc, getDoc } from "firebase/firestore";
import { Admin } from "@/types";
import { db } from "@/firebase/config";

export const getAdminById = async (id: string) => {
  try {
    const adminRef = doc(db, "admins", id);
    const adminDoc = await getDoc(adminRef);

    if (!adminDoc.exists()) return null;

    const adminData = adminDoc.data() as Admin;

    return {
      ...adminData,
      id: adminDoc.id,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
