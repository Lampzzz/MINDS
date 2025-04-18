import { db } from "../../config";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";

export const getAlerts = (callback: (alerts: any[]) => void) => {
  try {
    const alertsQuery = query(
      collection(db, "thresholdAlerts"),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(
      alertsQuery,
      (querySnapshot) => {
        const alertsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        callback(alertsData);
      },
      (error) => {
        console.error("Error in onSnapshot listener", error);
      }
    );

    return unsubscribe;
  } catch (e: unknown) {
    console.error("Error setting up alerts listener", e);
    return () => {};
  }
};
