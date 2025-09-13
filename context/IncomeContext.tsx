import React, { createContext, useContext, useReducer } from 'react';
import { Income } from '../services/incomeService';

interface IncomeState {
  incomes: Income[];
  loading: boolean;
  error: string | null;
}

type IncomeAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_INCOMES'; payload: Income[] }
  | { type: 'ADD_INCOME'; payload: Income }
  | { type: 'UPDATE_INCOME'; payload: Income }
  | { type: 'DELETE_INCOME'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null };

interface IncomeContextType {
  state: IncomeState;
  dispatch: React.Dispatch<IncomeAction>;
}

const IncomeContext = createContext<IncomeContextType | undefined>(undefined);

const incomeReducer = (state: IncomeState, action: IncomeAction): IncomeState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_INCOMES':
      return { ...state, incomes: action.payload, loading: false };
    case 'ADD_INCOME':
      return { ...state, incomes: [...state.incomes, action.payload] };
    case 'UPDATE_INCOME':
      return {
        ...state,
        incomes: state.incomes.map(income =>
          income.id === action.payload.id ? action.payload : income
        )
      };
    case 'DELETE_INCOME':
      return {
        ...state,
        incomes: state.incomes.filter(income => income.id !== action.payload)
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const IncomeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(incomeReducer, {
    incomes: [],
    loading: false,
    error: null
  });

  return (
    <IncomeContext.Provider value={{ state, dispatch }}>
      {children}
    </IncomeContext.Provider>
  );
};

export const useIncome = () => {
  const context = useContext(IncomeContext);
  if (context === undefined) {
    throw new Error('useIncome must be used within an IncomeProvider');
  }
  return context;
};
