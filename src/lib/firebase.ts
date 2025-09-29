
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "studio-2802846471-12997",
  appId: "1:261486337931:web:2764fb1c1276dbbe86998e",
  apiKey: "AIzaSyCalNxIND5McMxJ9iUUl04gOwsFX2nixp0",
  authDomain: "studio-2802846471-12997.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "261486337931"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
