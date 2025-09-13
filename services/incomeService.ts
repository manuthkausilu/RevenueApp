import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../firebase";

export interface Income {
  id?: string;
  amount: number;
  description: string;
  date: string;
  userId?: string;
}

const incomeCollection = collection(db, 'incomes');

// Create: Add a new income entry
export const addIncome = async (income: Omit<Income, 'id'>) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  const incomeData = { ...income, userId: user.uid };
  const docRef = await addDoc(incomeCollection, incomeData);
  return docRef.id;
};

// Read: Get all incomes for the current user
export const getIncomes = async (): Promise<Income[]> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  const q = query(collection(db, "incomes"), where("userId", "==", user.uid));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Convert Firestore Timestamp to string if it exists
      date: data.date?.toDate ? data.date.toDate().toISOString().split('T')[0] : data.date,
    } as Income;
  });
};

// Update: Update an existing income entry
export const updateIncome = async (id: string, updates: Partial<Omit<Income, 'id'>>) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  const docRef = doc(db, "incomes", id);
  await updateDoc(docRef, updates);
};

// Delete: Delete an income entry
export const deleteIncome = async (id: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  const docRef = doc(db, "incomes", id);
  await deleteDoc(docRef);
};

// Get total income
export const getTotalIncome = async (): Promise<number> => {
  const incomes = await getIncomes();
  return incomes.reduce((total, income) => total + income.amount, 0);
};
