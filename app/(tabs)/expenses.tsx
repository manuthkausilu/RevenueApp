import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ExpenseForm from '../../components/ExpenseForm';
import ExpenseList from '../../components/ExpenseList';
import { useExpense } from '../../context/ExpensesContext';
import { addExpense, deleteExpense, Expense, getExpenses, getTotalExpenses, updateExpense } from '../../services/expenseService';

const ExpensesScreen = () => {
  const { state, dispatch } = useExpense();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loadingTotal, setLoadingTotal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadExpenses();
    loadTotalExpenses();
  }, []);

  const loadExpenses = async () => {
    if (!refreshing) {
      dispatch({ type: 'SET_LOADING', payload: true });
    }
    try {
      const data = await getExpenses();
      dispatch({ type: 'SET_EXPENSES', payload: data });
    } catch (error) {
      console.error('Error loading expenses:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load expenses' });
    }
  };

  const loadTotalExpenses = async () => {
    setLoadingTotal(true);
    try {
      const total = await getTotalExpenses();
      setTotalExpenses(total);
    } catch (error) {
      console.error('Error loading total expenses:', error);
    } finally {
      setLoadingTotal(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadExpenses(), loadTotalExpenses()]);
    setRefreshing(false);
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
      loadTotalExpenses(); // Refresh total after adding/updating
    } catch (error) {
      console.error('Error saving expense:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save expense' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExpense(id);
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
      loadTotalExpenses(); // Refresh total after deleting
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

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthExpenses = state.expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });
  const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageExpense = state.expenses.length > 0 ? totalExpenses / state.expenses.length : 0;

  return (
    <LinearGradient colors={['#0F172A', '#1E293B', '#334155']} style={{ flex: 1 }}>
      <ScrollView 
        className="flex-1" 
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#EF4444"
            colors={['#EF4444']}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="p-5 pt-16">
          {/* Enhanced Header */}
          <View className="mb-8">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-4xl font-bold text-white">Expenses 📊</Text>
              <TouchableOpacity 
                onPress={loadTotalExpenses} 
                disabled={loadingTotal}
                className="bg-red-500/20 p-3 rounded-2xl"
                style={{
                  shadowColor: '#EF4444',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  elevation: 6,
                }}
              >
                {loadingTotal ? (
                  <ActivityIndicator size="small" color="#EF4444" />
                ) : (
                  <Ionicons name="refresh" size={20} color="#EF4444" />
                )}
              </TouchableOpacity>
            </View>
            <Text className="text-slate-300 text-lg">Monitor and control your spending patterns</Text>
          </View>

          {/* Main Total Card */}
          <View className="mb-6">
            <LinearGradient
              colors={['#DC2626', '#EF4444', '#F87171']}
              className="p-7 rounded-3xl"
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 32,
                shadowColor: '#EF4444',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.4,
                shadowRadius: 24,
                elevation: 15,
              }}
            >
              <View className="items-center mb-5">
                <View className="flex-row items-center justify-between w-full mb-4">
                  <View className="bg-white/30 p-5 rounded-3xl shadow-lg">
                    <Ionicons name="trending-down" size={36} color="#ffffff" />
                  </View>
                  <View className="bg-white/20 px-4 py-2 rounded-2xl">
                    <Text className="text-white text-sm font-semibold">Tracked</Text>
                  </View>
                </View>
                <Text className="text-white/95 text-xl font-bold text-center mb-2">Total Expenses</Text>
                <Text className="text-white/75 text-sm text-center">All time spending</Text>
              </View>
              <View className="items-center">
                <Text className="text-white text-5xl font-bold mb-4 text-center">
                  LKR {totalExpenses.toLocaleString()}
                </Text>
                <View className="flex-row items-center justify-center">
                  <View className="bg-white/20 p-1 rounded-full mr-2">
                    <Ionicons name="arrow-down" size={16} color="#ffffff" />
                  </View>
                  <Text className="text-white/90 text-sm text-center">
                    {state.expenses.length} expense{state.expenses.length !== 1 ? 's' : ''} • LKR {averageExpense.toFixed(0)} avg
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Enhanced Statistics Grid */}
          <View className="mb-8">
            <Text className="text-white text-xl font-bold mb-4">This Month</Text>
            <View className="flex-row space-x-3 mb-4">
              <View 
                className="bg-slate-800/70 backdrop-blur-sm rounded-3xl p-6 flex-1 border border-slate-700/40"
                style={{
                  borderRadius: 24,
                  shadowColor: '#DC2626',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.2,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <View className="items-center mb-3">
                  <View className="flex-row items-center justify-center mb-2">
                    <View className="bg-red-500/20 p-2 rounded-xl mr-2">
                      <Ionicons name="calendar" size={20} color="#EF4444" />
                    </View>
                    <Text className="text-slate-300 text-sm font-semibold">Monthly Total</Text>
                  </View>
                </View>
                <View className="items-center">
                  <Text className="text-white text-2xl font-bold text-center">
                    LKR {thisMonthTotal.toLocaleString()}
                  </Text>
                  <Text className="text-red-400 text-sm mt-2 text-center">
                    {thisMonthExpenses.length} entries
                  </Text>
                </View>
              </View>
              <View 
                className="bg-slate-800/70 backdrop-blur-sm rounded-3xl p-6 flex-1 border border-slate-700/40"
                style={{
                  borderRadius: 24,
                  shadowColor: '#3B82F6',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.2,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <View className="items-center mb-3">
                  <View className="flex-row items-center justify-center mb-2">
                    <View className="bg-blue-500/20 p-2 rounded-xl mr-2">
                      <Ionicons name="stats-chart" size={20} color="#3B82F6" />
                    </View>
                    <Text className="text-slate-300 text-sm font-semibold">Average</Text>
                  </View>
                </View>
                <View className="items-center">
                  <Text className="text-white text-2xl font-bold text-center">
                    LKR {averageExpense.toFixed(0)}
                  </Text>
                  <Text className="text-blue-400 text-sm mt-2 text-center">
                    per entry
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Expenses List Section */}
          <View className="mb-24">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-white text-xl font-bold">Recent Expenses</Text>
              <View className="bg-slate-700/60 px-4 py-2 rounded-2xl">
                <Text className="text-slate-300 text-sm font-semibold">
                  {state.expenses.length} total
                </Text>
              </View>
            </View>
            
            {state.loading ? (
              <View 
                className="bg-slate-800/50 rounded-3xl p-12 items-center border border-slate-700/40"
                style={{
                  borderRadius: 28,
                  shadowColor: '#1E293B',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 10,
                }}
              >
                <ActivityIndicator size="large" color="#EF4444" />
                <Text className="text-slate-400 mt-6 text-lg">Loading expense data...</Text>
                <Text className="text-slate-500 text-sm mt-2">Please wait while we fetch your records</Text>
              </View>
            ) : state.expenses.length === 0 ? (
              <View 
                className="bg-slate-800/50 rounded-3xl p-12 items-center border border-slate-700/40"
                style={{
                  borderRadius: 28,
                  shadowColor: '#1E293B',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 10,
                }}
              >
                <View className="bg-red-500/25 p-8 rounded-3xl mb-6 shadow-lg">
                  <Ionicons name="receipt" size={48} color="#EF4444" />
                </View>
                <Text className="text-slate-300 text-xl font-bold mb-3">No expenses recorded yet</Text>
                <Text className="text-slate-500 text-center text-base leading-6 mb-6">
                  Start tracking your spending to better understand your financial habits
                </Text>
                <TouchableOpacity 
                  onPress={() => openModal()}
                  className="bg-red-600 px-8 py-4 rounded-2xl"
                  style={{
                    shadowColor: '#DC2626',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    elevation: 8,
                  }}
                >
                  <Text className="text-white font-bold text-base">Add First Expense</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ExpenseList expenses={state.expenses} onEdit={openModal} onDelete={handleDelete} />
            )}
          </View>
        </View>
      </ScrollView>

      {/* Enhanced Floating Action Button */}
      <TouchableOpacity 
        onPress={() => openModal()} 
        className="absolute bottom-20 right-5"
        style={{
          shadowColor: '#EF4444',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.5,
          shadowRadius: 20,
          elevation: 15,
        }}
      >
        <LinearGradient
          colors={['#DC2626', '#EF4444']}
          className="p-6 rounded-3xl"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 24,
          }}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

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
