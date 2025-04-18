import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../../config";
import { Manager } from "@/types";
import { formatBirthDate } from "@/lib/utils";

export const updateManager = async (data: Partial<Manager>, id: string) => {
  try {
    const ref = doc(db, "managers", id);

    await updateDoc(ref, {
      ...data,
      age: formatBirthDate(data.dateOfBirth),
      updatedAt: Timestamp.now(),
    });

    return { success: true, message: "Manager Updated Successfully!" };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error.message };
  }
};
