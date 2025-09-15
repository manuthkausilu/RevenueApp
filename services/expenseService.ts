import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../firebase";

export interface Expense {
  id?: string;
  amount: number;
  description: string;
  date: string;
  userId?: string;
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
  const expenses = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Convert Firestore Timestamp to string if it exists
      date: data.date?.toDate ? data.date.toDate().toISOString().split('T')[0] : data.date,
    } as Expense;
  });
  
  // Debug: Log dates before sorting
  console.log('Expense dates before sorting:', expenses.map(e => ({ desc: e.description, date: e.date })));
  
  // Sort by date (latest first)
  const sortedExpenses = expenses.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    console.log(`Comparing: ${a.date} (${dateA.getTime()}) vs ${b.date} (${dateB.getTime()})`);
    return dateB.getTime() - dateA.getTime();
  });
  
  console.log('Expense dates after sorting:', sortedExpenses.map(e => ({ desc: e.description, date: e.date })));
  
  return sortedExpenses;
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

// Get total expenses
export const getTotalExpenses = async (): Promise<number> => {
  const expenses = await getExpenses();
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

// Get monthly expenses
export const getMonthlyExpenses = async (month: number, year: number): Promise<number> => {
  const expenses = await getExpenses();
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === month && expenseDate.getFullYear() === year;
  });
  return monthlyExpenses.reduce((total, expense) => total + expense.amount, 0);
};
