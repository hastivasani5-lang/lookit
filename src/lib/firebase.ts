// lib/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// 🔴 yaha apna firebaseConfig paste karo
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "lookit-login.firebaseapp.com",
  projectId: "lookit-login",
  storageBucket: "lookit-login.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

// Firebase initialize
const app = initializeApp(firebaseConfig);

// Auth export
export const auth = getAuth(app);

// Google Provider export
export const googleProvider = new GoogleAuthProvider();