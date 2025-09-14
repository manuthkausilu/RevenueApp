import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { getTotalExpenses } from '../../services/expenseService';
import { getTotalIncome } from '../../services/incomeService';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    try {
      if (!refreshing) setLoading(true);
      const [income, expenses] = await Promise.all([
        getTotalIncome(),
        getTotalExpenses()
      ]);
      setTotalIncome(income);
      setTotalExpenses(expenses);
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

  return (
    <LinearGradient
      colors={['#0F172A', '#1E293B', '#334155']}
      style={{ flex: 1 }}
    >
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#60A5FA"
            colors={['#60A5FA']}
          />
        }
      >
        <View style={{ paddingTop: 45, paddingBottom: 25, paddingHorizontal: 18 }}>
          {/* Extra Large Welcome Header */}
          <View className="mb-6">
            <View 
              className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-7 rounded-3xl border border-blue-500/30"
              style={{
                borderRadius: 20,
                shadowColor: '#3B82F6',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 15,
                elevation: 12,
              }}
            >
              <View className="items-center">
                <View className="bg-blue-500/20 p-4 rounded-2xl mb-3">
                  <Ionicons name="person-circle" size={40} color="#60A5FA" />
                </View>
                <Text className="text-3xl font-bold text-white mb-2 text-center">
                  Welcome back! 👋
                </Text>
                <Text className="text-blue-300 text-lg font-semibold text-center mb-2">
                  {user?.email?.split('@')[0] || 'User'}
                </Text>
                <Text className="text-slate-300 text-base text-center">
                  Ready to take control of your finances?
                </Text>
              </View>
            </View>
          </View>

          {loading && !refreshing ? (
            <View className="flex-1 justify-center items-center py-20">
              <ActivityIndicator size="large" color="#60A5FA" />
              <Text className="text-slate-300 mt-5 text-lg">Loading your data...</Text>
            </View>
          ) : (
            <>
              {/* Extra Large Financial Overview Header */}
              <View className="mb-5">
                <View 
                  className="bg-gradient-to-r from-emerald-600/20 to-blue-600/20 p-5 rounded-2xl border border-emerald-500/30"
                  style={{
                    borderRadius: 18,
                    shadowColor: '#10B981',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.25,
                    shadowRadius: 12,
                    elevation: 8,
                  }}
                >
                  <View className="flex-row items-center justify-center">
                    <View className="bg-emerald-500/20 p-3 rounded-xl mr-4">
                      <Ionicons name="analytics" size={26} color="#10B981" />
                    </View>
                    <View>
                      <Text className="text-white text-xl font-bold">Financial Overview</Text>
                      <Text className="text-emerald-300 text-base">Your money at a glance</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Extra Large Net Profit Card */}
              <View className="mb-5">
                <LinearGradient
                  colors={netProfit >= 0 ? ['#1E40AF', '#3B82F6'] : ['#D97706', '#F59E0B']}
                  className="p-7 rounded-3xl"
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 20,
                    shadowColor: netProfit >= 0 ? '#3B82F6' : '#F59E0B',
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: 0.4,
                    shadowRadius: 18,
                    elevation: 15,
                  }}
                >
                  <View className="items-center mb-5">
                    <View className="flex-row items-center justify-between w-full mb-4">
                      <View className="bg-white/25 p-4 rounded-2xl shadow-lg">
                        <Ionicons 
                          name={netProfit >= 0 ? "analytics" : "warning"} 
                          size={30} 
                          color="#ffffff" 
                        />
                      </View>
                      <View className="items-end bg-white/15 px-4 py-2 rounded-xl">
                        <Text className="text-white/80 text-base">Margin</Text>
                        <Text className="text-white text-xl font-bold">
                          {profitMargin.toFixed(1)}%
                        </Text>
                      </View>
                    </View>
                    <Text className="text-white/95 text-2xl font-bold text-center mb-2">Net Profit</Text>
                    <Text className="text-white/75 text-base text-center">
                      {netProfit >= 0 ? 'Positive cash flow' : 'Needs attention'}
                    </Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-white text-4xl font-bold mb-3 text-center">
                      LKR {Math.abs(netProfit).toLocaleString()}
                    </Text>
                    <Text className="text-white/85 text-base text-center">
                      {netProfit >= 0 ? '📈 Great job!' : '📉 Consider reducing expenses'}
                    </Text>
                  </View>
                </LinearGradient>
              </View>

              {/* Extra Large Main Stats Cards */}
              <View className="mb-5">
                <View className="flex-row mb-4">
                  <TouchableOpacity 
                    className="flex-1 mx-1.5" 
                    onPress={() => router.push('/(tabs)/income')}
                    style={{
                      shadowColor: '#059669',
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.3,
                      shadowRadius: 15,
                      elevation: 12,
                    }}
                  >
                    <LinearGradient
                      colors={['#059669', '#10B981']}
                      className="p-6 rounded-3xl"
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        borderRadius: 20,
                      }}
                    >
                      <View className="items-center mb-4">
                        <View className="bg-white/25 p-3 rounded-2xl shadow-lg mb-3">
                          <Ionicons name="trending-up" size={26} color="#ffffff" />
                        </View>
                        <View className="bg-white/15 px-3 py-1.5 rounded-full">
                          <Text className="text-white/90 text-sm font-medium">Total</Text>
                        </View>
                      </View>
                      <View className="items-center">
                        <Text className="text-white/90 text-base font-medium mb-2 text-center">Total Income</Text>
                        <Text className="text-white text-xl font-bold text-center">
                          LKR {totalIncome.toLocaleString()}
                        </Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    className="flex-1 mx-1.5" 
                    onPress={() => router.push('/(tabs)/expenses')}
                    style={{
                      shadowColor: '#DC2626',
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.3,
                      shadowRadius: 15,
                      elevation: 12,
                    }}
                  >
                    <LinearGradient
                      colors={['#DC2626', '#EF4444']}
                      className="p-6 rounded-3xl"
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        borderRadius: 20,
                      }}
                    >
                      <View className="items-center mb-4">
                        <View className="bg-white/25 p-3 rounded-2xl shadow-lg mb-3">
                          <Ionicons name="trending-down" size={26} color="#ffffff" />
                        </View>
                        <View className="bg-white/15 px-3 py-1.5 rounded-full">
                          <Text className="text-white/90 text-sm font-medium">Total</Text>
                        </View>
                      </View>
                      <View className="items-center">
                        <Text className="text-white/90 text-base font-medium mb-2 text-center">Total Expenses</Text>
                        <Text className="text-white text-xl font-bold text-center">
                          LKR {totalExpenses.toLocaleString()}
                        </Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Extra Large Quick Actions */}
              <View className="mb-5">
                <Text className="text-white text-lg font-bold mb-3">Quick Actions</Text>
                <View className="flex-row">
                  <TouchableOpacity 
                    className="flex-1 mx-1.5"
                    onPress={() => router.push('/(tabs)/income')}
                    style={{
                      shadowColor: '#059669',
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.25,
                      shadowRadius: 12,
                      elevation: 8,
                    }}
                  >
                    <LinearGradient
                      colors={['#059669', '#10B981']}
                      className="p-5 rounded-3xl"
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        borderRadius: 20,
                      }}
                    >
                      <View className="items-center">
                        <View className="bg-white/25 p-3 rounded-2xl mb-3 shadow-sm">
                          <Ionicons name="add-circle" size={28} color="white" />
                        </View>
                        <Text className="text-white font-bold text-base">Add Income</Text>
                        <Text className="text-white/85 text-base text-center mt-1">Record revenue</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    className="flex-1 mx-1.5"
                    onPress={() => router.push('/(tabs)/expenses')}
                    style={{
                      shadowColor: '#DC2626',
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.25,
                      shadowRadius: 12,
                      elevation: 8,
                    }}
                  >
                    <LinearGradient
                      colors={['#DC2626', '#EF4444']}
                      className="p-5 rounded-3xl"
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        borderRadius: 20,
                      }}
                    >
                      <View className="items-center">
                        <View className="bg-white/25 p-3 rounded-2xl mb-3 shadow-sm">
                          <Ionicons name="remove-circle" size={28} color="white" />
                        </View>
                        <Text className="text-white font-bold text-base">Add Expense</Text>
                        <Text className="text-white/85 text-base text-center mt-1">Track spending</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Extra Large Financial Health Score */}
              <View className="mb-5">
                <View 
                  className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-3xl border border-slate-700/40"
                  style={{
                    borderRadius: 20,
                    shadowColor: '#1E293B',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.25,
                    shadowRadius: 12,
                    elevation: 8,
                  }}
                >
                  <View className="items-center mb-4">
                    <View className="flex-row items-center justify-between w-full">
                      <Text className="text-white text-lg font-bold">Financial Health</Text>
                      <View className="bg-blue-500/25 px-4 py-2 rounded-xl">
                        <Text className="text-blue-400 font-medium text-base">
                          {netProfit >= 0 ? 'Healthy' : 'Needs Work'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View className="space-y-3">
                    <View className="flex-row justify-between items-center py-2">
                      <Text className="text-slate-300 text-base">Income Streams</Text>
                      <Text className="text-green-400 font-bold text-base">+LKR {totalIncome.toLocaleString()}</Text>
                    </View>
                    <View className="flex-row justify-between items-center py-2">
                      <Text className="text-slate-300 text-base">Total Expenses</Text>
                      <Text className="text-red-400 font-bold text-base">-LKR {totalExpenses.toLocaleString()}</Text>
                    </View>
                    <View className="h-px bg-slate-600 my-3 rounded-full" />
                    <View className="flex-row justify-between items-center py-2">
                      <Text className="text-white font-bold text-lg">Net Balance</Text>
                      <Text className={`font-bold text-xl ${netProfit >= 0 ? 'text-blue-400' : 'text-yellow-400'}`}>
                        {netProfit >= 0 ? '+' : ''}LKR {netProfit.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Extra Large Insights */}
              <View 
                className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-3xl border border-slate-700/40"
                style={{
                  borderRadius: 20,
                  shadowColor: '#1E293B',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.25,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <View className="flex-row items-center mb-4">
                  <View className="bg-blue-500/20 p-3 rounded-xl mr-3">
                    <Ionicons name="bulb" size={20} color="#60A5FA" />
                  </View>
                  <Text className="text-white text-lg font-bold">Smart Insights</Text>
                </View>
                <View className="space-y-2">
                  {totalIncome === 0 && totalExpenses === 0 ? (
                    <Text className="text-slate-300 text-base leading-6">
                      💡 Start by adding your first income or expense to see insights
                    </Text>
                  ) : (
                    <>
                      {netProfit > 0 && (
                        <Text className="text-slate-300 text-base leading-6">
                          💰 You're saving LKR {netProfit.toLocaleString()}. Consider investing!
                        </Text>
                      )}
                      {totalExpenses > totalIncome && (
                        <Text className="text-slate-300 text-base leading-6">
                          ⚠️ Expenses exceed income by LKR {(totalExpenses - totalIncome).toLocaleString()}
                        </Text>
                      )}
                      {totalIncome > 0 && totalExpenses / totalIncome > 0.8 && (
                        <Text className="text-slate-300 text-base leading-6">
                          📊 You're spending {((totalExpenses / totalIncome) * 100).toFixed(0)}% of income
                        </Text>
                      )}
                    </>
                  )}
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default HomeScreen;



