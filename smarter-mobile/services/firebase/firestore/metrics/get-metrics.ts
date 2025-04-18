import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../config";

export const getMetrics = async () => {
  try {
    const collectionRef = collection(db, "metrics");

    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => doc.data());

        // console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error(error);
  }
};
