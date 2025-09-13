import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJlGf_Y2JYZ5CHrv5f-mldZYafnKPfPKg",
  authDomain: "revenueapp-c9544.firebaseapp.com",
  projectId: "revenueapp-c9544",
  storageBucket: "revenueapp-c9544.firebasestorage.app",
  messagingSenderId: "997039066236",
  appId: "1:997039066236:web:83c9c3aa8380d9e5e5cdf9"
};

const app = initializeApp(firebaseConfig)

// export const auth = getAuth(app)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app)

// New function to save user data to Firestore
export const saveUserToFirestore = async (uid: string, userData: { email: string; [key: string]: any }) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, {
      ...userData,
      createdAt: new Date(),
    });
    console.log('User saved to Firestore');
  } catch (error) {
    console.error('Error saving user to Firestore:', error);
    throw error;
  }
};
