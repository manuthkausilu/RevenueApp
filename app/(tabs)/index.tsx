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
    // Only load data if user is authenticated
    if (user) {
      loadFinancialData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadFinancialData = async () => {
    // Double check user authentication
    if (!user) {
      setLoading(false);
      return;
    }

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
    if (!user) return;
    
    setRefreshing(true);
    await loadFinancialData();
    setRefreshing(false);
  };

  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100) : 0;

  // Calculate actual monthly profit
  const monthlyProfit = monthlyIncome - monthlyExpenses;
  const monthlyProfitMargin = monthlyIncome > 0 ? ((monthlyProfit / monthlyIncome) * 100) : 0;

  // Dashboard items - all using new blue color
  const dashboardItems = [
    {
      id: 'quick-add-income',
      title: 'Add Income',
      subtitle: 'Record new revenue',
      icon: 'add-circle',
      color: '#2563EB',
      onPress: () => router.push('/(tabs)/income')
    },
    {
      id: 'quick-add-expense',
      title: 'Add Expense',
      subtitle: 'Track new spending',
      icon: 'remove-circle',
      color: '#2563EB',
      onPress: () => router.push('/(tabs)/expenses')
    },
    {
      id: 'view-income',
      title: 'View Income',
      subtitle: `LKR ${totalIncome.toLocaleString()}`,
      icon: 'trending-up',
      color: '#2563EB',
      onPress: () => router.push('/(tabs)/income')
    },
    {
      id: 'view-expenses',
      title: 'View Expenses',
      subtitle: `LKR ${totalExpenses.toLocaleString()}`,
      icon: 'trending-down',
      color: '#2563EB',
      onPress: () => router.push('/(tabs)/expenses')
    }
  ];

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
            elevation: 8,
          }}
        >
          <View className="items-center">
            {/* App name / brand */}
            <Text style={{ color: '#2563EB', fontSize: 18, fontWeight: '800', marginBottom: 6 }}>
              BIZTRACK
            </Text>

            <Text className="text-4xl font-bold text-black mb-2 text-center">Welcome Back! 👋</Text>
            <Text className="text-blue-600 text-lg font-semibold text-center mb-2">
              {userProfile?.name || user?.displayName || user?.email?.split('@')[0] || 'User'}
            </Text>
            <Text className="text-gray-600 text-base text-center leading-6">
              Take control of your finances with ease
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
                <Ionicons 
                  name="analytics" 
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
        <Text className="text-black text-xl font-bold mb-6 text-center">Financial Overview</Text>
        
        {/* Monthly Profit Card */}
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
                  <Ionicons 
                    name="analytics" 
                    size={20} 
                    color="#2563EB" 
                  />
                </View>
                <Text className="text-gray-700 text-sm font-semibold">Monthly Profit</Text>
              </View>
            </View>
            <View className="items-center">
              <Text className="text-black text-xl font-bold text-center">
                LKR {Math.abs(monthlyProfit).toLocaleString()}
              </Text>
              <Text className="text-blue-600 text-sm mt-2 text-center">
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
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <View className="bg-white rounded-3xl p-6 border border-gray-200">
              <View className="items-center mb-3">
                <View className="flex-row items-center justify-center mb-2">
                  <View className="bg-blue-100 p-2 rounded-xl mr-2">
                    <Ionicons name="trending-up" size={20} color="#2563EB" />
                  </View>
                  <Text className="text-gray-700 text-sm font-semibold">Total Income</Text>
                </View>
              </View>
              <View className="items-center">
                <Text className="text-black text-xl font-bold text-center">
                  LKR {totalIncome.toLocaleString()}
                </Text>
                <Text className="text-blue-600 text-sm mt-2 text-center">
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
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <View className="bg-white rounded-3xl p-6 border border-gray-200">
              <View className="items-center mb-3">
                <View className="flex-row items-center justify-center mb-2">
                  <View className="bg-blue-100 p-2 rounded-xl mr-2">
                    <Ionicons name="trending-down" size={20} color="#2563EB" />
                  </View>
                  <Text className="text-gray-700 text-sm font-semibold">Total Expenses</Text>
                </View>
              </View>
              <View className="items-center">
                <Text className="text-black text-xl font-bold text-center">
                  LKR {totalExpenses.toLocaleString()}
                </Text>
                <Text className="text-blue-600 text-sm mt-2 text-center">
                  All time spending
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Dashboard List Header */}
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-black text-xl font-bold">Quick Actions</Text>
        <View className="bg-gray-100 px-4 py-2 rounded-2xl">
          <Text className="text-gray-600 text-sm font-semibold">
            Dashboard
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
        <Ionicons name="analytics" size={48} color="#2563EB" />
      </View>
      <Text className="text-black text-xl font-bold mb-3">Welcome to Your Dashboard</Text>
      <Text className="text-gray-600 text-center text-base leading-6 mb-6">
        Start by adding your first income or expense to see your financial overview
      </Text>
      <TouchableOpacity 
        onPress={() => router.push('/(tabs)/income')}
        style={{
          backgroundColor: '#2563EB',
          paddingHorizontal: 32,
          paddingVertical: 16,
          borderRadius: 16,
          shadowColor: '#2563EB',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );

  const renderDashboardItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity 
        onPress={item.onPress}
        className="bg-white rounded-3xl p-4 mb-3 mx-4 border border-gray-200"
        style={{
          borderRadius: 16,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 4,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View 
              className="p-3 rounded-xl mr-3"
              style={{ backgroundColor: `${item.color}20` }}
            >
              <Ionicons name={item.icon} size={22} color={item.color} />
            </View>
            <View className="flex-1 mr-3">
              <Text className="text-black font-bold text-sm">
                {item.title}
              </Text>
              <Text className="text-gray-600 text-xs">
                {item.subtitle}
              </Text>
            </View>
          </View>
          
          <View className="flex-row items-center">
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#FFFFFF', '#F8FAFC', '#E2E8F0']} style={{ flex: 1 }}>
      <FlatList
        data={dashboardItems}
        renderItem={renderDashboardItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={loading ? (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="text-gray-600 mt-6 text-lg">Loading dashboard...</Text>
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
    </LinearGradient>
  );
};

export default HomeScreen;