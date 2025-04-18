import { db } from "@/firebase/config";
import { doc, updateDoc } from "firebase/firestore";

export const updateEmergencyById = async (id: string, status: string) => {
  try {
    const emergencyData = doc(db, "reports", id);

    await updateDoc(emergencyData, {
      status: status,
    });

    return { success: true, message: "Emergency Updated Successfully!" };
  } catch (error: any) {
    console.error("Error: ", error.message);
    return { success: false, message: error.message };
  }
};
