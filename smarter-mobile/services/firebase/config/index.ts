import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "@firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "@firebase/storage";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "@firebase/auth";
import { FirebaseConfig } from "@/types";

const config: FirebaseConfig = {
  apiKey: "AIzaSyB6xelReDA6YXzLl4K29VPfvnDGRIuZkDk",
  authDomain: "smarter-b2908.firebaseapp.com",
  projectId: "smarter-b2908",
  storageBucket: "smarter-b2908.appspot.com",
  messagingSenderId: "554749243276",
  appId: "1:554749243276:android:bb03cbb8b92a4aff0530a9",
  measurementId: "",
};

const app = initializeApp(config);
const db = getFirestore(app);
const storage = getStorage(app);
let auth: any;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (error: any) {
  if (error.code === "auth/already-initialized") {
    auth = getAuth(app);
  } else {
    console.error("Firebase Auth Error:", error);
    auth = getAuth(app);
  }
}

export { app, db, storage, auth };
