import React, { createContext, useContext, useReducer } from 'react';
import { Expense } from '../services/expenseService';

interface ExpenseState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
}

type ExpenseAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null };

interface ExpenseContextType {
  state: ExpenseState;
  dispatch: React.Dispatch<ExpenseAction>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const expenseReducer = (state: ExpenseState, action: ExpenseAction): ExpenseState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload, loading: false };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense.id === action.payload.id ? action.payload : expense
        )
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload)
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, {
    expenses: [],
    loading: false,
    error: null
  });

  return (
    <ExpenseContext.Provider value={{ state, dispatch }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
