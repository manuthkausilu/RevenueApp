import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="pt-12 pb-6">
        {/* Header */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-gray-800">Dashboard</Text>
              <Text className="text-gray-600">Welcome back, {user?.displayName || user?.email?.split('@')[0]}</Text>
            </View>
            {user?.photoURL && (
              <Image
                source={{ uri: user.photoURL }}
                className="w-12 h-12 rounded-full"
              />
            )}
          </View>
        </View>

        {/* Quick Stats Cards */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between mb-4">
            <View className="bg-white p-4 rounded-2xl flex-1 mr-2" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 }}>
              <View className="flex-row items-center mb-2">
                <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-2">
                  <Text className="text-blue-600 font-bold">↗</Text>
                </View>
                <Text className="text-blue-600 font-semibold">Income</Text>
              </View>
              <Text className="text-2xl font-bold text-blue-800">$0</Text>
              <Text className="text-gray-500 text-sm">This month</Text>
            </View>
            <View className="bg-white p-4 rounded-2xl flex-1 ml-2" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 }}>
              <View className="flex-row items-center mb-2">
                <View className="w-8 h-8 bg-red-100 rounded-full items-center justify-center mr-2">
                  <Text className="text-red-600 font-bold">↘</Text>
                </View>
                <Text className="text-red-600 font-semibold">Expenses</Text>
              </View>
              <Text className="text-2xl font-bold text-red-800">$0</Text>
              <Text className="text-gray-500 text-sm">This month</Text>
            </View>
          </View>

          <View className="bg-white p-4 rounded-2xl" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 }}>
            <View className="flex-row items-center mb-2">
              <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-2">
                <Text className="text-green-600 font-bold">💰</Text>
              </View>
              <Text className="text-green-600 font-semibold">Net Balance</Text>
            </View>
            <Text className="text-2xl font-bold text-green-800">$0</Text>
            <Text className="text-gray-500 text-sm">Total balance</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Quick Actions</Text>
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/income")}
              className="bg-blue-500 p-4 rounded-2xl flex-1 mr-2"
              style={{ shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 }}
            >
              <Text className="text-white text-center font-semibold text-lg">+ Add Income</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/expenses")}
              className="bg-red-500 p-4 rounded-2xl flex-1 ml-2"
              style={{ shadowColor: '#EF4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 }}
            >
              <Text className="text-white text-center font-semibold text-lg">+ Add Expense</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View className="px-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Recent Activity</Text>
          <View className="bg-white p-6 rounded-2xl" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 }}>
            <Text className="text-gray-500 text-center">No transactions yet</Text>
            <Text className="text-gray-400 text-center text-sm mt-1">Start by adding your first income or expense</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}