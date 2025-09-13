import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../firebase";

export interface Expense {
  id?: string;
  amount: number;
  description: string;
  date: string;
}

const expenseCollection = collection(db, 'expenses');

// Create: Add a new expense entry
export const addExpense = async (expense: Omit<Expense, 'id'>) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  const expenseData = { ...expense, userId: user.uid };
  return await addDoc(expenseCollection, expenseData);
};

// Read: Get all expenses for the current user
export const getExpenses = async (): Promise<Expense[]> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  const q = query(collection(db, "expenses"), where("userId", "==", user.uid));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Convert Firestore Timestamp to string if it exists
      date: data.date?.toDate ? data.date.toDate().toISOString().split('T')[0] : data.date,
    } as Expense;
  });
};

// Update: Update an existing expense entry
export const updateExpense = async (id: string, updates: Partial<Omit<Expense, 'id'>>) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  const docRef = doc(db, "expenses", id);
  await updateDoc(docRef, updates);
};

// Delete: Delete an expense entry
export const deleteExpense = async (id: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  const docRef = doc(db, "expenses", id);
  await deleteDoc(docRef);
};
