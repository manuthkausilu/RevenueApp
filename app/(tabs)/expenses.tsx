import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import ExpenseForm from '../../components/ExpenseForm';
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
      // Ensure data is sorted by date (latest first) before dispatching
      const sortedData = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      dispatch({ type: 'SET_EXPENSES', payload: sortedData });
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
      // Reload and sort data after adding/updating
      await loadExpenses();
      loadTotalExpenses();
    } catch (error) {
      console.error('Error saving expense:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save expense' });
    }
  };

  const handleDelete = async (id: string, description: string) => {
    Alert.alert(
      'Delete Expense',
      `Are you sure you want to delete "${description}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(id);
              dispatch({ type: 'DELETE_EXPENSE', payload: id });
              // Reload and sort data after deleting
              await loadExpenses();
              loadTotalExpenses();
            } catch (error) {
              console.error('Error deleting expense:', error);
              dispatch({ type: 'SET_ERROR', payload: 'Failed to delete expense' });
            }
          },
        },
      ],
      { cancelable: true }
    );
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

  const renderHeader = () => (
    <>
      {/* Enhanced Header */}
      <View className="mb-8">
        <View 
          className="bg-gradient-to-r from-red-600/20 to-pink-600/20 p-6 rounded-3xl border border-red-500/30"
          style={{
            borderRadius: 24,
            shadowColor: '#EF4444',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 12,
          }}
        >
          <View className="items-center">
            <View className="bg-red-500/20 p-4 rounded-2xl mb-4">
              <Ionicons name="receipt" size={40} color="#EF4444" />
            </View>
            <Text className="text-4xl font-bold text-white mb-2 text-center">Expenses 📊</Text>
            <Text className="text-red-300 text-lg font-semibold text-center mb-2">
              Spending Control
            </Text>
            <Text className="text-slate-300 text-base text-center leading-6">
              Monitor and control your spending patterns effectively
            </Text>
          </View>
        </View>
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
            <Text className="text-white text-3xl font-bold mb-4 text-center">
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
        <Text className="text-white text-xl font-bold mb-6 text-center">This Month</Text>
        
        {/* Monthly Total Card */}
        <View className="mb-4 mx-6">
          <View 
            className="bg-slate-800/70 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/40"
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
              <Text className="text-white text-xl font-bold text-center">
                LKR {thisMonthTotal.toLocaleString()}
              </Text>
              <Text className="text-red-400 text-sm mt-2 text-center">
                {thisMonthExpenses.length} entries
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Expenses List Header */}
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-white text-xl font-bold">Recent Expenses</Text>
        <View className="bg-slate-700/60 px-4 py-2 rounded-2xl">
          <Text className="text-slate-300 text-sm font-semibold">
            {state.expenses.length} total
          </Text>
        </View>
      </View>
    </>
  );

  const renderEmptyState = () => (
    <View 
      className="bg-slate-800/50 rounded-3xl p-12 items-center border border-slate-700/40 mx-5"
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
  );

  const renderExpenseItem = ({ item }: { item: Expense }) => {
    const truncateDescription = (desc: string, maxLength: number = 25) => {
      return desc.length > maxLength ? `${desc.substring(0, maxLength)}...` : desc;
    };

    return (
      <View 
        className="bg-slate-800/50 rounded-3xl p-4 mb-3 mx-4 border border-slate-700/40"
        style={{
          borderRadius: 16,
          shadowColor: '#1E293B',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 4,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className="bg-red-500/20 p-3 rounded-xl mr-3">
              <Ionicons name="trending-down" size={22} color="#EF4444" />
            </View>
            <View className="flex-1 mr-3">
              <Text className="text-white font-bold text-sm" numberOfLines={1} ellipsizeMode="tail">
                {truncateDescription(item.description, 20)}
              </Text>
              <Text className="text-slate-400 text-xs" numberOfLines={1}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>
          </View>
          
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={() => openModal(item)}
              className="bg-blue-500/20 p-2 rounded-lg mr-2"
            >
              <Ionicons name="pencil" size={16} color="#60A5FA" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleDelete(item.id!, item.description)}
              className="bg-red-500/20 p-2 rounded-lg"
            >
              <Ionicons name="trash" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View className="flex-row items-center justify-end mt-3 pt-3 border-t border-slate-600/30">
          <View 
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
            }}
          >
            <View 
              style={{
                width: 24,
                height: 24,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 6,
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                borderRadius: 6,
              }}
            >
              <Ionicons 
                name="remove" 
                size={16} 
                color="#EF4444"
              />
            </View>
            <Text 
              style={{
                color: '#EF4444',
                fontSize: 16,
                fontWeight: 'bold',
                letterSpacing: 0.3,
              }}
            >
              LKR {item.amount.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={['#0F172A', '#1E293B', '#334155']} style={{ flex: 1 }}>
      <FlatList
        data={state.expenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id!}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={state.loading ? (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#EF4444" />
            <Text className="text-slate-400 mt-6 text-lg">Loading expense data...</Text>
          </View>
        ) : renderEmptyState}
        contentContainerStyle={{ 
          paddingTop: 64, 
          paddingBottom: 120,
          flexGrow: 1 
        }}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#EF4444"
            colors={['#EF4444']}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Modern Floating Action Button */}
      <View 
        className="absolute bottom-20 right-5"
        style={{
          shadowColor: '#EF4444',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          elevation: 15,
        }}
      >
        <TouchableOpacity 
          onPress={() => openModal()}
          style={{
            backgroundColor: '#EF4444',
            borderRadius: 20,
            padding: 12,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Glassmorphism overlay */}
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 20,
          }} />
          
          {/* Animated pulse effect */}
          <View style={{
            position: 'absolute',
            top: -8,
            left: -8,
            right: -8,
            bottom: -8,
            backgroundColor: 'rgba(239, 68, 68, 0.3)',
            borderRadius: 28,
            opacity: 0.6,
          }} />
          
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}>
            <Ionicons name="add" size={20} color="white" style={{ marginRight: 4 }} />
            <Text style={{
              color: 'white',
              fontSize: 12,
              fontWeight: '700',
              letterSpacing: 0.5,
            }}>
              Expense
            </Text>
          </View>
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