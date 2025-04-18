import { Timestamp, addDoc, collection } from "firebase/firestore";
import { formatBirthDate } from "@/lib/utils";
import { Member } from "@/types";
import { format } from "date-fns";
import { db } from "@/firebase/config";

export const createMembers = async (data: Member[], managerId: string) => {
  try {
    const promises = data.map(async (value) => {
      return addDoc(collection(db, "members"), {
        ...value,
        managerId,
        age: formatBirthDate(value.dateOfBirth),
        dateOfBirth: format(value.dateOfBirth, "yyyy-MM-dd"),
        createdAt: Timestamp.now(),
      });
    });

    await Promise.all(promises);
  } catch (error) {
    console.error(error);
  }
};
