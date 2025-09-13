import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import ExpenseForm from '../../components/ExpenseForm';
import ExpenseList from '../../components/ExpenseList';
import { useExpense } from '../../context/ExpensesContext';
import { addExpense, deleteExpense, Expense, getExpenses, updateExpense } from '../../services/expenseService';

const ExpensesScreen = () => {
  const { state, dispatch } = useExpense();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await getExpenses();
      dispatch({ type: 'SET_EXPENSES', payload: data });
    } catch (error) {
      console.error('Error loading expenses:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load expenses' });
    }
  };

  const handleSave = async (expenseData: Omit<Expense, 'id'>) => {
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id!, expenseData);
        dispatch({ type: 'UPDATE_EXPENSE', payload: { ...expenseData, id: editingExpense.id! } });
      } else {
        const docRef = await addExpense(expenseData);
        dispatch({ type: 'ADD_EXPENSE', payload: { ...expenseData, id: docRef.id } });
      }
      closeModal();
    } catch (error) {
      console.error('Error saving expense:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save expense' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExpense(id);
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
    } catch (error) {
      console.error('Error deleting expense:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete expense' });
    }
  };

  const openModal = (expense?: Expense) => {
    setEditingExpense(expense || null);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingExpense(null);
  };

  return (
    <LinearGradient colors={['#1f2937', '#111827', '#000000']} style={{ flex: 1 }}>
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold text-white mb-4">Expenses</Text>
        {state.loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <ExpenseList expenses={state.expenses} onEdit={openModal} onDelete={handleDelete} />
        )}
        <TouchableOpacity onPress={() => openModal()} className="absolute bottom-20 right-4 bg-red-600 p-4 rounded-full">
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ExpenseForm
        visible={modalVisible}
        onClose={closeModal}
        onSave={handleSave}
        editingExpense={editingExpense}
      />
    </LinearGradient>
  );
};

export default ExpensesScreen;
