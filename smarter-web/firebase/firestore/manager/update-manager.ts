import { doc, setDoc } from "firebase/firestore";
import { format } from "date-fns";
import { auth, db } from "@/firebase/config";
import { Resident } from "@/types";
import { updatePassword } from "firebase/auth";

export const updateManager = async (data: Partial<Resident>, id: string) => {
  try {
    const ref = doc(db, "managers", id);

    const { newPassword, ...rest } = data;

    if (newPassword && newPassword.length > 0) {
      await updatePassword(auth.currentUser!, newPassword);
    }

    await setDoc(ref, {
      ...rest,
      dateOfBirth: format(data.dateOfBirth, "yyyy-MM-dd"),
    });

    return { success: true, message: "Manager Updated Successfully!" };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error.message };
  }
};
