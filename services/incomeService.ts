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
  const incomes = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Convert Firestore Timestamp to string if it exists
      date: data.date?.toDate ? data.date.toDate().toISOString().split('T')[0] : data.date,
    } as Income;
  });
  
  // Debug: Log dates before sorting
  console.log('Income dates before sorting:', incomes.map(i => ({ desc: i.description, date: i.date })));
  
  // Sort by date (latest first)
  const sortedIncomes = incomes.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    console.log(`Comparing: ${a.date} (${dateA.getTime()}) vs ${b.date} (${dateB.getTime()})`);
    return dateB.getTime() - dateA.getTime();
  });
  
  console.log('Income dates after sorting:', sortedIncomes.map(i => ({ desc: i.description, date: i.date })));
  
  return sortedIncomes;
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

// Get monthly income
export const getMonthlyIncome = async (month: number, year: number): Promise<number> => {
  const incomes = await getIncomes();
  const monthlyIncomes = incomes.filter(income => {
    const incomeDate = new Date(income.date);
    return incomeDate.getMonth() === month && incomeDate.getFullYear() === year;
  });
  return monthlyIncomes.reduce((total, income) => total + income.amount, 0);
};
