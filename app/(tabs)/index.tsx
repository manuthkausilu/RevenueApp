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

  const StatCard = ({ title, amount, icon, colors, textColor, onPress }: {
    title: string;
    amount: number;
    icon: string;
    colors: string[];
    textColor: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity 
      className="flex-1 mx-1" 
      onPress={onPress}
      disabled={!onPress}
      style={{
        shadowColor: colors[0],
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
      }}
    >
      <LinearGradient
        colors={colors}
        className="p-6 rounded-3xl"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 24,
        }}
      >
        <View className="items-center mb-4">
          <View className="bg-white/25 p-3 rounded-2xl shadow-lg mb-2">
            <Ionicons name={icon as any} size={26} color="#ffffff" />
          </View>
          <View className="bg-white/15 px-3 py-1 rounded-full">
            <Text className="text-white/90 text-xs font-semibold">Total</Text>
          </View>
        </View>
        <View className="items-center">
          <Text className="text-white/90 text-sm font-semibold mb-2 text-center">{title}</Text>
          <Text className="text-white text-2xl font-bold text-center">
            LKR {amount.toLocaleString()}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const QuickActionCard = ({ title, subtitle, icon, colors, onPress }: {
    title: string;
    subtitle: string;
    icon: string;
    colors: string[];
    onPress: () => void;
  }) => (
    <TouchableOpacity 
      className="flex-1 mx-1"
      onPress={onPress}
      style={{
        shadowColor: colors[0],
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
      }}
    >
      <LinearGradient
        colors={colors}
        className="p-5 rounded-3xl"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 24,
        }}
      >
        <View className="items-center">
          <View className="bg-white/25 p-4 rounded-2xl mb-4 shadow-sm">
            <Ionicons name={icon as any} size={32} color="white" />
          </View>
          <Text className="text-white font-bold text-lg">{title}</Text>
          <Text className="text-white/85 text-sm text-center mt-1">{subtitle}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

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
        <View style={{ paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20 }}>
          {/* Welcome Header */}
          <View className="mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-3xl font-bold text-white mb-1">
                  Welcome back! 👋
                </Text>
                <Text className="text-slate-300 text-lg">
                  {user?.email?.split('@')[0] || 'User'}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={onRefresh}
                className="bg-slate-700/50 p-3 rounded-2xl"
                disabled={loading || refreshing}
                style={{
                  shadowColor: '#60A5FA',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 10,
                  elevation: 5,
                }}
              >
                {(loading || refreshing) ? (
                  <ActivityIndicator size="small" color="#60A5FA" />
                ) : (
                  <Ionicons name="refresh" size={24} color="#60A5FA" />
                )}
              </TouchableOpacity>
            </View>
            <Text className="text-slate-400">Here's your financial overview</Text>
          </View>

          {loading && !refreshing ? (
            <View className="flex-1 justify-center items-center py-20">
              <ActivityIndicator size="large" color="#60A5FA" />
              <Text className="text-slate-300 mt-4 text-lg">Loading your data...</Text>
            </View>
          ) : (
            <>
              {/* Main Stats Cards */}
              <View className="mb-8">
                <Text className="text-white text-xl font-bold mb-4">Financial Overview</Text>
                <View className="flex-row mb-4">
                  <StatCard
                    title="Total Income"
                    amount={totalIncome}
                    icon="trending-up"
                    colors={['#059669', '#10B981']}
                    textColor="text-green-400"
                    onPress={() => router.push('/(tabs)/income')}
                  />
                  <StatCard
                    title="Total Expenses"
                    amount={totalExpenses}
                    icon="trending-down"
                    colors={['#DC2626', '#EF4444']}
                    textColor="text-red-400"
                    onPress={() => router.push('/(tabs)/expenses')}
                  />
                </View>
              </View>

              {/* Net Profit Card */}
              <View className="mb-8">
                <LinearGradient
                  colors={netProfit >= 0 ? ['#1E40AF', '#3B82F6'] : ['#D97706', '#F59E0B']}
                  className="p-7 rounded-3xl"
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 28,
                    shadowColor: netProfit >= 0 ? '#3B82F6' : '#F59E0B',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                    elevation: 12,
                  }}
                >
                  <View className="items-center mb-5">
                    <View className="flex-row items-center justify-between w-full mb-4">
                      <View className="bg-white/25 p-4 rounded-2xl shadow-sm">
                        <Ionicons 
                          name={netProfit >= 0 ? "analytics" : "warning"} 
                          size={32} 
                          color="#ffffff" 
                        />
                      </View>
                      <View className="items-end bg-white/15 px-4 py-2 rounded-2xl">
                        <Text className="text-white/80 text-sm">Margin</Text>
                        <Text className="text-white text-lg font-bold">
                          {profitMargin.toFixed(1)}%
                        </Text>
                      </View>
                    </View>
                    <Text className="text-white/95 text-xl font-bold text-center mb-2">Net Profit</Text>
                    <Text className="text-white/75 text-sm text-center">
                      {netProfit >= 0 ? 'Positive cash flow' : 'Needs attention'}
                    </Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-white text-4xl font-bold mb-3 text-center">
                      LKR {Math.abs(netProfit).toLocaleString()}
                    </Text>
                    <Text className="text-white/85 text-base text-center">
                      {netProfit >= 0 ? '📈 Great job managing your finances!' : '📉 Consider reducing expenses'}
                    </Text>
                  </View>
                </LinearGradient>
              </View>

              {/* Quick Actions */}
              <View className="mb-8">
                <Text className="text-white text-xl font-bold mb-4">Quick Actions</Text>
                <View className="flex-row">
                  <QuickActionCard
                    title="Add Income"
                    subtitle="Record new revenue"
                    icon="add-circle"
                    colors={['#059669', '#10B981']}
                    onPress={() => router.push('/(tabs)/income')}
                  />
                  <QuickActionCard
                    title="Add Expense"
                    subtitle="Track spending"
                    icon="remove-circle"
                    colors={['#DC2626', '#EF4444']}
                    onPress={() => router.push('/(tabs)/expenses')}
                  />
                </View>
              </View>

              {/* Financial Health Score */}
              <View className="mb-8">
                <View 
                  className="bg-slate-800/70 backdrop-blur-sm p-7 rounded-3xl border border-slate-700/40"
                  style={{
                    borderRadius: 28,
                    shadowColor: '#1E293B',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.4,
                    shadowRadius: 16,
                    elevation: 10,
                  }}
                >
                  <View className="items-center mb-5">
                    <View className="flex-row items-center justify-between w-full">
                      <Text className="text-white text-xl font-bold">Financial Health</Text>
                      <View className="bg-blue-500/25 px-4 py-2 rounded-2xl">
                        <Text className="text-blue-400 font-semibold">
                          {netProfit >= 0 ? 'Healthy' : 'Needs Work'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View className="space-y-4">
                    <View className="flex-row justify-between items-center py-2">
                      <Text className="text-slate-300">Income Streams</Text>
                      <Text className="text-green-400 font-bold">+LKR {totalIncome.toLocaleString()}</Text>
                    </View>
                    <View className="flex-row justify-between items-center py-2">
                      <Text className="text-slate-300">Total Expenses</Text>
                      <Text className="text-red-400 font-bold">-LKR {totalExpenses.toLocaleString()}</Text>
                    </View>
                    <View className="h-px bg-slate-600 my-4 rounded-full" />
                    <View className="flex-row justify-between items-center py-2">
                      <Text className="text-white font-bold text-lg">Net Balance</Text>
                      <Text className={`font-bold text-xl ${netProfit >= 0 ? 'text-blue-400' : 'text-yellow-400'}`}>
                        {netProfit >= 0 ? '+' : ''}LKR {netProfit.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Insights */}
              <View 
                className="bg-slate-800/70 backdrop-blur-sm p-7 rounded-3xl border border-slate-700/40"
                style={{
                  borderRadius: 28,
                  shadowColor: '#1E293B',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.4,
                  shadowRadius: 16,
                  elevation: 10,
                }}
              >
                <View className="flex-row items-center mb-5">
                  <View className="bg-blue-500/20 p-3 rounded-2xl mr-3">
                    <Ionicons name="bulb" size={24} color="#60A5FA" />
                  </View>
                  <Text className="text-white text-xl font-bold">Smart Insights</Text>
                </View>
                <View className="space-y-3">
                  {totalIncome === 0 && totalExpenses === 0 ? (
                    <Text className="text-slate-300 text-base leading-6">
                      💡 Start by adding your first income or expense to see personalized insights
                    </Text>
                  ) : (
                    <>
                      {netProfit > 0 && (
                        <Text className="text-slate-300 text-base leading-6">
                          💰 You're saving LKR {netProfit.toLocaleString()} this period. Consider investing it!
                        </Text>
                      )}
                      {totalExpenses > totalIncome && (
                        <Text className="text-slate-300 text-base leading-6">
                          ⚠️ Your expenses exceed income by LKR {(totalExpenses - totalIncome).toLocaleString()}
                        </Text>
                      )}
                      {totalIncome > 0 && totalExpenses / totalIncome > 0.8 && (
                        <Text className="text-slate-300 text-base leading-6">
                          📊 You're spending {((totalExpenses / totalIncome) * 100).toFixed(0)}% of your income
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

