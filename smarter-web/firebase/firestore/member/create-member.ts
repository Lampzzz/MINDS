import { Timestamp, addDoc, collection } from "firebase/firestore";
import { formatBirthDate } from "@/lib/utils";
import { Member } from "@/types";
import { format } from "date-fns";
import { db } from "@/firebase/config";

export const createMember = async (data: Member) => {
  try {
    const ref = collection(db, "members");

    await addDoc(ref, {
      ...data,
      dateOfBirth: format(data.dateOfBirth, "yyyy-MM-dd"),
      age: formatBirthDate(data.dateOfBirth),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return { success: true, message: "Member Created Successfully!" };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error.message };
  }
};
