import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration loaded from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyAHfSoBKJQGuueVdHAYEsb62dFMRq02nOw",
  authDomain: "manisha-first-project-489912.firebaseapp.com",
  projectId: "manisha-first-project-489912",
  storageBucket: "manisha-first-project-489912.firebasestorage.app",
  messagingSenderId: "238464347261",
  appId: "1:238464347261:web:46b7b8a33d5611ddd09514"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
