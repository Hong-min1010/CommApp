import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKey199KSVXNwjXYQ_vXO1GK84olq0afE",
  authDomain: "commapp-5a492.firebaseapp.com",
  projectId: "commapp-5a492",
  storageBucket: "commapp-5a492.firebasestorage.app",
  messagingSenderId: "324481072534",
  appId: "1:324481072534:web:99ffec4dc41b75c9dab1b7",
  measurementId: "G-YMBGM9K3RJ"
};

const app = initializeApp(firebaseConfig);

export { app };

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);