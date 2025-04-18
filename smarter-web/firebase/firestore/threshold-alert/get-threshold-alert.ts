import { db } from "@/firebase/config";
import { ErrorHandler } from "@/lib/utils";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

export const getThresholdAlert = async () => {
  const result = { data: null, error: null };

  try {
    const thresholdAlertQuery = query(
      collection(db, "thresholdAlerts"),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(thresholdAlertQuery, async (snapshot) => {
      try {
        const thresholdAlert = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        return { ...result, data: thresholdAlert[0] };
      } catch (error: unknown) {
        return { ...result, error: ErrorHandler(error, "Get Threshold Alert") };
      }
    });

    return { ...result, unsubscribe };
  } catch (error: unknown) {
    return { data: null, error: ErrorHandler(error, "Get Threshold Alert") };
  }
};
