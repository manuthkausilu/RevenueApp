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
    // Add a small delay to ensure auth state is established
    const timer = setTimeout(() => {
      loadExpenses();
      loadTotalExpenses();
    }, 500);

    return () => clearTimeout(timer);
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
          className="bg-blue-50 p-6 rounded-3xl border border-blue-200"
          style={{
            borderRadius: 24,
            shadowColor: '#2563EB',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.1,
            shadowRadius: 16,
            elevation: 12,
          }}
        >
          <View className="items-center">
            <View className="bg-blue-100 p-4 rounded-2xl mb-4">
              <Ionicons name="receipt" size={40} color="#2563EB" />
            </View>
            <Text className="text-4xl font-bold text-black mb-2 text-center">Expenses</Text>
            <Text className="text-blue-600 text-lg font-semibold text-center mb-2">
              Spending Control
            </Text>
            <Text className="text-gray-600 text-base text-center leading-6">
              Monitor and control your spending patterns effectively
            </Text>
          </View>
        </View>
      </View>

      {/* Main Total Card */}
      <View className="mb-6">
        <LinearGradient
          colors={['#2563EB', '#3B82F6', '#60A5FA']}
          className="p-7 rounded-3xl"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 32,
            shadowColor: '#2563EB',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.2,
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
        <Text className="text-black text-xl font-bold mb-6 text-center">This Month</Text>
        
        {/* Monthly Total Card */}
        <View className="mb-4 mx-6">
          <View 
            className="bg-white rounded-3xl p-6 border border-gray-200"
            style={{
              borderRadius: 24,
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <View className="items-center mb-3">
              <View className="flex-row items-center justify-center mb-2">
                <View className="bg-blue-100 p-2 rounded-xl mr-2">
                  <Ionicons name="calendar" size={20} color="#2563EB" />
                </View>
                <Text className="text-gray-700 text-sm font-semibold">Monthly Total</Text>
              </View>
            </View>
            <View className="items-center">
              <Text className="text-black text-xl font-bold text-center">
                LKR {thisMonthTotal.toLocaleString()}
              </Text>
              <Text className="text-blue-600 text-sm mt-2 text-center">
                {thisMonthExpenses.length} entries
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Expenses List Header */}
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-black text-xl font-bold">Recent Expenses</Text>
        <View className="bg-gray-100 px-4 py-2 rounded-2xl">
          <Text className="text-gray-600 text-sm font-semibold">
            {state.expenses.length} total
          </Text>
        </View>
      </View>
    </>
  );

  const renderEmptyState = () => (
    <View 
      className="bg-white rounded-3xl p-12 items-center border border-gray-200 mx-5"
      style={{
        borderRadius: 28,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 10,
      }}
    >
      <View className="bg-blue-100 p-8 rounded-3xl mb-6">
        <Ionicons name="receipt" size={48} color="#2563EB" />
      </View>
      <Text className="text-black text-xl font-bold mb-3">No expenses recorded yet</Text>
      <Text className="text-gray-600 text-center text-base leading-6 mb-6">
        Start tracking your spending to better understand your financial habits
      </Text>
      <TouchableOpacity 
        onPress={() => openModal()}
        style={{
          backgroundColor: '#2563EB',
          paddingHorizontal: 32,
          paddingVertical: 16,
          borderRadius: 16,
          shadowColor: '#2563EB',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Add First Expense</Text>
      </TouchableOpacity>
    </View>
  );

  const renderExpenseItem = ({ item }: { item: Expense }) => {
    const truncateDescription = (desc: string, maxLength: number = 40) =>
      desc.length > maxLength ? `${desc.substring(0, maxLength)}...` : desc;

    const formatDate = (dateString: string) => {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString();
      } catch {
        return dateString;
      }
    };

    return (
      // wrapper spacing
      <View style={{ marginHorizontal: 12, marginBottom: 8 }}>
        {/* curved card */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#fff',
            borderRadius: 16,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 6,
            elevation: 2,
            borderWidth: 1,
            borderColor: '#E6EEF9',
          }}
        >
          {/* curved left stripe */}
          <View
            style={{
              width: 12,
              backgroundColor: '#2563EB',
              borderTopLeftRadius: 16,
              borderBottomLeftRadius: 16,
            }}
          />

          {/* content */}
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 10 }}>
            {/* small icon */}
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: '#DBEAFE',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}
            >
              <Ionicons name="receipt" size={18} color="#2563EB" />
            </View>

            {/* text block */}
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 13, fontWeight: '600', color: '#0F172A' }}>
                {truncateDescription(item.description)}
              </Text>
              <Text style={{ fontSize: 11, color: '#64748B', marginTop: 3 }}>{formatDate(item.date)}</Text>
            </View>

            {/* amount + actions */}
            <View style={{ alignItems: 'flex-end', marginLeft: 8 }}>
              <View
                style={{
                  backgroundColor: '#EEF2FF',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 14,
                }}
              >
                <Text style={{ color: '#2563EB', fontWeight: '700', fontSize: 11 }}>
                   LKR {item.amount.toLocaleString()}
                 </Text>
               </View>

              <View style={{ flexDirection: 'row', marginTop: 6 }}>
                <TouchableOpacity
                  onPress={() => openModal(item)}
                  style={{
                    backgroundColor: '#F3F4F6',
                    padding: 6,
                    borderRadius: 8,
                    marginRight: 8,
                  }}
                >
                  <Ionicons name="pencil" size={14} color="#475569" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDelete(item.id!, item.description)}
                  style={{
                    backgroundColor: 'transparent',
                    padding: 6,
                    borderRadius: 8,
                  }}
                >
                  <Ionicons name="trash" size={16} color="#DC2626" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={['#FFFFFF', '#F8FAFC', '#E2E8F0']} style={{ flex: 1 }}>
      <FlatList
        data={state.expenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id!}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={state.loading ? (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="text-gray-600 mt-6 text-lg">Loading expense data...</Text>
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
            tintColor="#2563EB"
            colors={['#2563EB']}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Modern Floating Action Button */}
      <View 
        className="absolute bottom-20 right-5"
        style={{
          shadowColor: '#2563EB',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
          elevation: 15,
        }}
      >
        <TouchableOpacity 
          onPress={() => openModal()}
          style={{
            backgroundColor: '#2563EB',
            borderRadius: 20,
            padding: 12,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
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
