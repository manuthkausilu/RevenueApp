import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
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

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    try {
      setLoading(true);
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

  const netProfit = totalIncome - totalExpenses;

  const StatCard = ({ title, amount, icon, color, bgColor }: {
    title: string;
    amount: number;
    icon: string;
    color: string;
    bgColor: string;
  }) => (
    <View className={`${bgColor} p-4 rounded-xl flex-1 mx-1`}>
      <View className="flex-row items-center justify-between mb-2">
        <Ionicons name={icon as any} size={24} color={color} />
        <TouchableOpacity onPress={loadFinancialData}>
          <Ionicons name="refresh" size={16} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
      <Text className="text-gray-300 text-sm">{title}</Text>
      <Text className={`text-2xl font-bold ${color === '#10B981' ? 'text-green-400' : color === '#EF4444' ? 'text-red-400' : 'text-blue-400'}`}>
        ${amount.toLocaleString()}
      </Text>
    </View>
  );

  return (
    <LinearGradient
      colors={['#1f2937', '#111827', '#000000']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View style={{ paddingTop: 48, paddingBottom: 24, paddingHorizontal: width * 0.05 }}>
          {/* Header */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-white mb-2">Welcome back!</Text>
            <Text className="text-gray-300">Hello {user?.email}</Text>
            <Text className="text-lg font-semibold text-white mt-4 mb-2">Financial Overview</Text>
          </View>

          {loading ? (
            <View className="flex-1 justify-center items-center py-20">
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text className="text-gray-300 mt-4">Loading financial data...</Text>
            </View>
          ) : (
            <>
              {/* Financial Summary Cards */}
              <View className="mb-6">
                {/* Top Row - Income and Expenses */}
                <View className="flex-row mb-4">
                  <StatCard
                    title="Total Income"
                    amount={totalIncome}
                    icon="trending-up"
                    color="#10B981"
                    bgColor="bg-gray-800"
                  />
                  <StatCard
                    title="Total Expenses"
                    amount={totalExpenses}
                    icon="trending-down"
                    color="#EF4444"
                    bgColor="bg-gray-800"
                  />
                </View>

                {/* Bottom Row - Net Profit */}
                <View className="bg-gray-800 p-6 rounded-xl">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                      <Ionicons 
                        name={netProfit >= 0 ? "analytics" : "warning"} 
                        size={28} 
                        color={netProfit >= 0 ? "#3B82F6" : "#F59E0B"} 
                      />
                      <Text className="text-white text-lg font-semibold ml-3">Net Profit</Text>
                    </View>
                    <TouchableOpacity onPress={loadFinancialData}>
                      <Ionicons name="refresh" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                  <Text className={`text-3xl font-bold ${netProfit >= 0 ? 'text-blue-400' : 'text-yellow-400'}`}>
                    ${netProfit.toLocaleString()}
                  </Text>
                  <Text className={`text-sm mt-1 ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {netProfit >= 0 ? '📈 Positive cash flow' : '📉 Negative cash flow'}
                  </Text>
                </View>
              </View>

              {/* Quick Actions */}
              <View className="mb-6">
                <Text className="text-white text-lg font-semibold mb-4">Quick Actions</Text>
                <View className="flex-row justify-between">
                  <TouchableOpacity 
                    className="bg-green-600 p-4 rounded-xl flex-1 mr-2"
                    onPress={() => router.push('/(tabs)/income')}
                  >
                    <Ionicons name="add-circle" size={24} color="white" />
                    <Text className="text-white font-semibold mt-2">Add Income</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="bg-red-600 p-4 rounded-xl flex-1 ml-2"
                    onPress={() => router.push('/(tabs)/expenses')}
                  >
                    <Ionicons name="remove-circle" size={24} color="white" />
                    <Text className="text-white font-semibold mt-2">Add Expense</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Recent Activity Summary */}
              <View className="bg-gray-800 p-4 rounded-xl">
                <Text className="text-white text-lg font-semibold mb-3">Summary</Text>
                <View className="space-y-2">
                  <View className="flex-row justify-between">
                    <Text className="text-gray-300">Income Sources</Text>
                    <Text className="text-green-400 font-semibold">+${totalIncome.toLocaleString()}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-300">Total Expenses</Text>
                    <Text className="text-red-400 font-semibold">-${totalExpenses.toLocaleString()}</Text>
                  </View>
                  <View className="h-px bg-gray-600 my-2" />
                  <View className="flex-row justify-between">
                    <Text className="text-white font-semibold">Net Result</Text>
                    <Text className={`font-bold ${netProfit >= 0 ? 'text-blue-400' : 'text-yellow-400'}`}>
                      ${netProfit.toLocaleString()}
                    </Text>
                  </View>
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

