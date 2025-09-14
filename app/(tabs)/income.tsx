import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import IncomeForm from '../../components/IncomeForm';
import { useIncome } from '../../context/IncomeContext';
import { addIncome, deleteIncome, getIncomes, getTotalIncome, Income, updateIncome } from '../../services/incomeService';

const IncomeScreen = () => {
  const { state, dispatch } = useIncome();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [totalIncome, setTotalIncome] = useState(0);
  const [loadingTotal, setLoadingTotal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadIncomes();
    loadTotalIncome();
  }, []);

  const loadIncomes = async () => {
    if (!refreshing) {
      dispatch({ type: 'SET_LOADING', payload: true });
    }
    try {
      const data = await getIncomes();
      // Ensure data is sorted by date (latest first) before dispatching
      const sortedData = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      dispatch({ type: 'SET_INCOMES', payload: sortedData });
    } catch (error) {
      console.error('Error loading incomes:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load incomes' });
    }
  };

  const loadTotalIncome = async () => {
    setLoadingTotal(true);
    try {
      const total = await getTotalIncome();
      setTotalIncome(total);
    } catch (error) {
      console.error('Error loading total income:', error);
    } finally {
      setLoadingTotal(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadIncomes(), loadTotalIncome()]);
    setRefreshing(false);
  };

  const handleSave = async (incomeData: Omit<Income, 'id'>) => {
    try {
      if (editingIncome) {
        await updateIncome(editingIncome.id!, incomeData);
        dispatch({ type: 'UPDATE_INCOME', payload: { ...incomeData, id: editingIncome.id! } });
      } else {
        const id = await addIncome(incomeData);
        dispatch({ type: 'ADD_INCOME', payload: { ...incomeData, id } });
      }
      closeModal();
      // Reload and sort data after adding/updating
      await loadIncomes();
      loadTotalIncome();
    } catch (error) {
      console.error('Error saving income:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save income' });
    }
  };

  const handleDelete = async (id: string, description: string) => {
    Alert.alert(
      'Delete Income',
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
              await deleteIncome(id);
              dispatch({ type: 'DELETE_INCOME', payload: id });
              // Reload and sort data after deleting
              await loadIncomes();
              loadTotalIncome();
            } catch (error) {
              console.error('Error deleting income:', error);
              dispatch({ type: 'SET_ERROR', payload: 'Failed to delete income' });
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const openModal = (income?: Income) => {
    setEditingIncome(income || null);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingIncome(null);
  };

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthIncomes = state.incomes.filter(income => {
    const incomeDate = new Date(income.date);
    return incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear;
  });
  const thisMonthTotal = thisMonthIncomes.reduce((sum, income) => sum + income.amount, 0);
  const averageIncome = state.incomes.length > 0 ? totalIncome / state.incomes.length : 0;

  const renderHeader = () => (
    <>
      {/* Enhanced Header */}
      <View className="mb-8">
        <View 
          className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 p-6 rounded-3xl border border-green-500/30"
          style={{
            borderRadius: 24,
            shadowColor: '#10B981',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 12,
          }}
        >
          <View className="items-center">
            <View className="bg-green-500/20 p-4 rounded-2xl mb-4">
              <Ionicons name="wallet" size={40} color="#10B981" />
            </View>
            <Text className="text-4xl font-bold text-white mb-2 text-center">Income 💰</Text>
            <Text className="text-green-300 text-lg font-semibold text-center mb-2">
              Revenue Management
            </Text>
            <Text className="text-slate-300 text-base text-center leading-6">
              Track and manage your revenue streams with ease
            </Text>
          </View>
        </View>
      </View>

      {/* Main Total Card */}
      <View className="mb-6">
        <LinearGradient
          colors={['#059669', '#10B981', '#34D399']}
          className="p-7 rounded-3xl"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 32,
            shadowColor: '#10B981',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.4,
            shadowRadius: 24,
            elevation: 15,
          }}
        >
          <View className="items-center mb-5">
            <View className="flex-row items-center justify-between w-full mb-4">
              <View className="bg-white/30 p-5 rounded-3xl shadow-lg">
                <Ionicons name="trending-up" size={36} color="#ffffff" />
              </View>
              <View className="bg-white/20 px-4 py-2 rounded-2xl">
                <Text className="text-white text-sm font-semibold">Active</Text>
              </View>
            </View>
            <Text className="text-white/95 text-xl font-bold text-center mb-2">Total Income</Text>
            <Text className="text-white/75 text-sm text-center">All time earnings</Text>
          </View>
          <View className="items-center">
            <Text className="text-white text-3xl font-bold mb-4 text-center">
              LKR {totalIncome.toLocaleString()}
            </Text>
            <View className="flex-row items-center justify-center">
              <View className="bg-white/20 p-1 rounded-full mr-2">
                <Ionicons name="arrow-up" size={16} color="#ffffff" />
              </View>
              <Text className="text-white/90 text-sm text-center">
                {state.incomes.length} income source{state.incomes.length !== 1 ? 's' : ''} • LKR {averageIncome.toFixed(0)} avg
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
              shadowColor: '#059669',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <View className="items-center mb-3">
              <View className="flex-row items-center justify-center mb-2">
                <View className="bg-green-500/20 p-2 rounded-xl mr-2">
                  <Ionicons name="calendar" size={20} color="#10B981" />
                </View>
                <Text className="text-slate-300 text-sm font-semibold">Monthly Total</Text>
              </View>
            </View>
            <View className="items-center">
              <Text className="text-white text-xl font-bold text-center">
                LKR {thisMonthTotal.toLocaleString()}
              </Text>
              <Text className="text-green-400 text-sm mt-2 text-center">
                {thisMonthIncomes.length} entries
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Income List Header */}
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-white text-xl font-bold">Recent Income</Text>
        <View className="bg-slate-700/60 px-4 py-2 rounded-2xl">
          <Text className="text-slate-300 text-sm font-semibold">
            {state.incomes.length} total
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
      <View className="bg-green-500/25 p-8 rounded-3xl mb-6 shadow-lg">
        <Ionicons name="wallet" size={48} color="#10B981" />
      </View>
      <Text className="text-slate-300 text-xl font-bold mb-3">No income recorded yet</Text>
      <Text className="text-slate-500 text-center text-base leading-6 mb-6">
        Start building your financial future by recording your first income source
      </Text>
      <TouchableOpacity 
        onPress={() => openModal()}
        className="bg-green-600 px-8 py-4 rounded-2xl"
        style={{
          shadowColor: '#059669',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <Text className="text-white font-bold text-base">Add First Income</Text>
      </TouchableOpacity>
    </View>
  );

  const renderIncomeItem = ({ item }: { item: Income }) => {
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
            <View className="bg-green-500/20 p-3 rounded-xl mr-3">
              <Ionicons name="trending-up" size={22} color="#10B981" />
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
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
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
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderRadius: 6,
              }}
            >
              <Ionicons 
                name="add" 
                size={16} 
                color="#10B981"
              />
            </View>
            <Text 
              style={{
                color: '#10B981',
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
        data={state.incomes}
        renderItem={renderIncomeItem}
        keyExtractor={(item) => item.id!}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={state.loading ? (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#10B981" />
            <Text className="text-slate-400 mt-6 text-lg">Loading income data...</Text>
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
            tintColor="#10B981"
            colors={['#10B981']}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Modern Floating Action Button */}
      <View 
        className="absolute bottom-20 right-5"
        style={{
          shadowColor: '#10B981',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          elevation: 15,
        }}
      >
        <TouchableOpacity 
          onPress={() => openModal()}
          style={{
            backgroundColor: '#10B981',
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
            backgroundColor: 'rgba(16, 185, 129, 0.3)',
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
              Income
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <IncomeForm
        visible={modalVisible}
        onClose={closeModal}
        onSave={handleSave}
        editingIncome={editingIncome}
      />
    </LinearGradient>
  );
};

export default IncomeScreen;