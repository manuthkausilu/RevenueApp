import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJlGf_Y2JYZ5CHrv5f-mldZYafnKPfPKg",
  authDomain: "revenueapp-c9544.firebaseapp.com",
  projectId: "revenueapp-c9544",
  storageBucket: "revenueapp-c9544.firebasestorage.app",
  messagingSenderId: "997039066236",
  appId: "1:997039066236:web:83c9c3aa8380d9e5e5cdf9"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
