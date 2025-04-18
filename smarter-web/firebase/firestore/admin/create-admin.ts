import { Timestamp, doc, setDoc } from "firebase/firestore";
import { Admin } from "@/types";
import { db } from "@/firebase/config";

export const createAdmin = async (data: Admin) => {
  const { name, email, id } = data;

  try {
    await setDoc(doc(db, "admins", id), {
      name: name,
      email: email,
      createdAt: Timestamp.now(),
    });

    return { success: true, message: "Admin created successfully" };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error.message };
  }
};
