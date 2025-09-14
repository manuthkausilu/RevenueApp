import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export interface UserProfile {
  uid: string;
  email: string;
  name?: string;
  createdAt: string;
}

// Get user profile from Firestore
export const getUserProfile = async (): Promise<UserProfile | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    const userDoc = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDoc);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Save user profile to Firestore (for future use)
export const saveUserProfile = async (userData: Omit<UserProfile, 'uid'>) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  
  const userDoc = doc(db, 'users', user.uid);
  await setDoc(userDoc, {
    ...userData,
    uid: user.uid,
  });
};
