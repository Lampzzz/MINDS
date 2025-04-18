import { createUserWithEmailAndPassword } from "firebase/auth";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { Resident } from "@/types";
import { format } from "date-fns";
import { db, secondaryAuth } from "@/firebase/config";
import { createMembers } from "../member";
import { createReleaseShelter } from "../release-shelter";

export const createManager = async (data: Resident) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      secondaryAuth,
      data.email,
      data.password!
    );

    const { members, password, shelterId, releaseById, ...managerData } = data;

    const managerDocRef = doc(db, "managers", userCredential.user.uid);
    await setDoc(managerDocRef, {
      ...managerData,
      dateOfBirth: format(data.dateOfBirth, "yyyy-MM-dd"),
      createdAt: Timestamp.now(),
    });

    await createMembers(members, managerDocRef.id);
    await createReleaseShelter({
      shelterId,
      releaseById,
      releaseToId: managerDocRef.id,
    });

    await secondaryAuth.signOut();

    return { success: true, message: "Resident Created Successfully!" };
  } catch (error: any) {
    console.error("Create manager error:", error.message);
    let errorMessage = "";

    if (error.code === "auth/email-already-in-use") {
      errorMessage = "Email already exist";
    } else {
      errorMessage = error.message;
    }

    return { success: false, message: errorMessage };
  }
};
