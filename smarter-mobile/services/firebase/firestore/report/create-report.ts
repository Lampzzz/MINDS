import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../config";

interface Report {
  category: string;
  managerId: string;
  shelterId: string;
  description: string;
  createdAt?: string;
}

export const createReport = async (data: Report) => {
  try {
    const ref = collection(db, "reports");

    await addDoc(ref, {
      ...data,
      status: "pending",
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error creating report:", error);
    return null;
  }
};
