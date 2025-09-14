import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { getMonthlyExpenses, getTotalExpenses } from '../../services/expenseService';
import { getMonthlyIncome, getTotalIncome } from '../../services/incomeService';

const HomeScreen = () => {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    try {
      if (!refreshing) setLoading(true);
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const [income, expenses, monthlyIncomeData, monthlyExpensesData] = await Promise.all([
        getTotalIncome(),
        getTotalExpenses(),
        getMonthlyIncome(currentMonth, currentYear),
        getMonthlyExpenses(currentMonth, currentYear)
      ]);
      
      setTotalIncome(income);
      setTotalExpenses(expenses);
      setMonthlyIncome(monthlyIncomeData);
      setMonthlyExpenses(monthlyExpensesData);
    } catch (error) {
      console.error('Error loading financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFinancialData();
    setRefreshing(false);
  };

  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100) : 0;

  // Calculate actual monthly profit
  const monthlyProfit = monthlyIncome - monthlyExpenses;
  const monthlyProfitMargin = monthlyIncome > 0 ? ((monthlyProfit / monthlyIncome) * 100) : 0;

  // Dashboard items following Income screen pattern
  const dashboardItems = [
    {
      id: 'quick-add-income',
      title: 'Add Income',
      subtitle: 'Record new revenue',
      icon: 'add-circle',
      color: '#10B981',
      onPress: () => router.push('/(tabs)/income')
    },
    {
      id: 'quick-add-expense',
      title: 'Add Expense',
      subtitle: 'Track new spending',
      icon: 'remove-circle',
      color: '#EF4444',
      onPress: () => router.push('/(tabs)/expenses')
    },
    {
      id: 'view-income',
      title: 'View Income',
      subtitle: `LKR ${totalIncome.toLocaleString()}`,
      icon: 'trending-up',
      color: '#10B981',
      onPress: () => router.push('/(tabs)/income')
    },
    {
      id: 'view-expenses',
      title: 'View Expenses',
      subtitle: `LKR ${totalExpenses.toLocaleString()}`,
      icon: 'trending-down',
      color: '#EF4444',
      onPress: () => router.push('/(tabs)/expenses')
    }
  ];

  const renderHeader = () => (
    <>
      {/* Enhanced Header */}
      <View className="mb-8">
        <View 
          className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 rounded-3xl border border-blue-500/30"
          style={{
            borderRadius: 24,
            shadowColor: '#3B82F6',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 12,
          }}
        >
          <View className="items-center">
            <View className="bg-blue-500/20 p-4 rounded-2xl mb-4">
              <Ionicons name="person-circle" size={40} color="#60A5FA" />
            </View>
            <Text className="text-4xl font-bold text-white mb-2 text-center">Welcome Back! 👋</Text>
            <Text className="text-blue-300 text-lg font-semibold text-center mb-2">
              {userProfile?.name || user?.displayName || user?.email?.split('@')[0] || 'User'}
            </Text>
            <Text className="text-slate-300 text-base text-center leading-6">
              Take control of your finances with ease
            </Text>
          </View>
        </View>
      </View>

      {/* Main Total Card */}
      <View className="mb-6">
        <LinearGradient
          colors={netProfit >= 0 
            ? ['#1E40AF', '#3B82F6', '#60A5FA'] 
            : ['#D97706', '#F59E0B', '#FCD34D']
          }
          className="p-7 rounded-3xl"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 32,
            shadowColor: netProfit >= 0 ? '#3B82F6' : '#F59E0B',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.4,
            shadowRadius: 24,
            elevation: 15,
          }}
        >
          <View className="items-center mb-5">
            <View className="flex-row items-center justify-between w-full mb-4">
              <View className="bg-white/30 p-5 rounded-3xl shadow-lg">
                <Ionicons 
                  name={netProfit >= 0 ? "analytics" : "warning"} 
                  size={36} 
                  color="#ffffff" 
                />
              </View>
              <View className="bg-white/20 px-4 py-2 rounded-2xl">
                <Text className="text-white text-sm font-semibold">
                  {netProfit >= 0 ? 'Profit' : 'Loss'}
                </Text>
              </View>
            </View>
            <Text className="text-white/95 text-xl font-bold text-center mb-2">Net Balance</Text>
            <Text className="text-white/75 text-sm text-center">
              {netProfit >= 0 ? 'Positive cash flow' : 'Needs attention'}
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-white text-3xl font-bold mb-4 text-center">
              LKR {Math.abs(netProfit).toLocaleString()}
            </Text>
            <View className="flex-row items-center justify-center">
              <View className="bg-white/20 p-1 rounded-full mr-2">
                <Ionicons 
                  name={netProfit >= 0 ? "arrow-up" : "arrow-down"} 
                  size={16} 
                  color="#ffffff" 
                />
              </View>
              <Text className="text-white/90 text-sm text-center">
                {profitMargin.toFixed(1)}% margin • Income: LKR {totalIncome.toLocaleString()}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Enhanced Statistics Grid */}
      <View className="mb-8">
        <Text className="text-white text-xl font-bold mb-6 text-center">Financial Overview</Text>
        
        {/* Monthly Profit Card */}
        <View className="mb-4 mx-6">
          <View 
            className="bg-slate-800/70 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/40"
            style={{
              borderRadius: 24,
              shadowColor: monthlyProfit >= 0 ? '#3B82F6' : '#F59E0B',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <View className="items-center mb-3">
              <View className="flex-row items-center justify-center mb-2">
                <View className={`${monthlyProfit >= 0 ? 'bg-blue-500/20' : 'bg-yellow-500/20'} p-2 rounded-xl mr-2`}>
                  <Ionicons 
                    name={monthlyProfit >= 0 ? "analytics" : "warning"} 
                    size={20} 
                    color={monthlyProfit >= 0 ? "#3B82F6" : "#F59E0B"} 
                  />
                </View>
                <Text className="text-slate-300 text-sm font-semibold">Monthly Profit</Text>
              </View>
            </View>
            <View className="items-center">
              <Text className="text-white text-xl font-bold text-center">
                LKR {Math.abs(monthlyProfit).toLocaleString()}
              </Text>
              <Text className={`${monthlyProfit >= 0 ? 'text-blue-400' : 'text-yellow-400'} text-sm mt-2 text-center`}>
                {monthlyProfit >= 0 ? 'This month profit' : 'This month loss'} • {monthlyProfitMargin.toFixed(1)}% margin
              </Text>
            </View>
          </View>
        </View>
        
        {/* Total Income Card */}
        <View className="mb-4 mx-6">
          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/income')}
            style={{
              shadowColor: '#059669',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <View className="bg-slate-800/70 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/40">
              <View className="items-center mb-3">
                <View className="flex-row items-center justify-center mb-2">
                  <View className="bg-green-500/20 p-2 rounded-xl mr-2">
                    <Ionicons name="trending-up" size={20} color="#10B981" />
                  </View>
                  <Text className="text-slate-300 text-sm font-semibold">Total Income</Text>
                </View>
              </View>
              <View className="items-center">
                <Text className="text-white text-xl font-bold text-center">
                  LKR {totalIncome.toLocaleString()}
                </Text>
                <Text className="text-green-400 text-sm mt-2 text-center">
                  All time earnings
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Total Expenses Card */}
        <View className="mb-4 mx-6">
          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/expenses')}
            style={{
              shadowColor: '#DC2626',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <View className="bg-slate-800/70 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/40">
              <View className="items-center mb-3">
                <View className="flex-row items-center justify-center mb-2">
                  <View className="bg-red-500/20 p-2 rounded-xl mr-2">
                    <Ionicons name="trending-down" size={20} color="#EF4444" />
                  </View>
                  <Text className="text-slate-300 text-sm font-semibold">Total Expenses</Text>
                </View>
              </View>
              <View className="items-center">
                <Text className="text-white text-xl font-bold text-center">
                  LKR {totalExpenses.toLocaleString()}
                </Text>
                <Text className="text-red-400 text-sm mt-2 text-center">
                  All time spending
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Dashboard List Header */}
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-white text-xl font-bold">Quick Actions</Text>
        <View className="bg-slate-700/60 px-4 py-2 rounded-2xl">
          <Text className="text-slate-300 text-sm font-semibold">
            Dashboard
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
      <View className="bg-blue-500/25 p-8 rounded-3xl mb-6 shadow-lg">
        <Ionicons name="analytics" size={48} color="#60A5FA" />
      </View>
      <Text className="text-slate-300 text-xl font-bold mb-3">Welcome to Your Dashboard</Text>
      <Text className="text-slate-500 text-center text-base leading-6 mb-6">
        Start by adding your first income or expense to see your financial overview
      </Text>
      <TouchableOpacity 
        onPress={() => router.push('/(tabs)/income')}
        className="bg-blue-600 px-8 py-4 rounded-2xl"
        style={{
          shadowColor: '#3B82F6',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <Text className="text-white font-bold text-base">Get Started</Text>
      </TouchableOpacity>
    </View>
  );

  const renderDashboardItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity 
        onPress={item.onPress}
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
            <View 
              className="p-3 rounded-xl mr-3"
              style={{ backgroundColor: `${item.color}33` }}
            >
              <Ionicons name={item.icon} size={22} color={item.color} />
            </View>
            <View className="flex-1 mr-3">
              <Text className="text-white font-bold text-sm">
                {item.title}
              </Text>
              <Text className="text-slate-400 text-xs">
                {item.subtitle}
              </Text>
            </View>
          </View>
          
          <View className="flex-row items-center">
            <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.4)" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#0F172A', '#1E293B', '#334155']} style={{ flex: 1 }}>
      <FlatList
        data={dashboardItems}
        renderItem={renderDashboardItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={loading ? (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#60A5FA" />
            <Text className="text-slate-400 mt-6 text-lg">Loading dashboard...</Text>
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
            tintColor="#60A5FA"
            colors={['#60A5FA']}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
};

export default HomeScreen;