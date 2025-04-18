import { db } from "@/firebase/config";
import { formatBirthDate } from "@/lib/utils";
import { Member } from "@/types";
import { format } from "date-fns";
import { Timestamp, doc, setDoc } from "firebase/firestore";

export const updateMember = async (data: Member, id: string) => {
  try {
    const ref = doc(db, "members", id);
    await setDoc(ref, {
      ...data,
      dateOfBirth: format(data.dateOfBirth, "yyyy-MM-dd"),
      age: formatBirthDate(data.dateOfBirth),
      updatedAt: Timestamp.now(),
      managerId: data.managerId === "none" ? null : data.managerId,
    });

    return { success: true, message: "Member Updated Successfully!" };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error.message };
  }
};
