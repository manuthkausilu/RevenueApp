import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ExpensesScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="pt-12 pb-6">
        {/* Header */}
        <View className="px-6 mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">Expenses</Text>
          <Text className="text-gray-600">Track and categorize your spending</Text>
        </View>

        {/* Add Expense Button */}
        <View className="px-6 mb-6">
          <TouchableOpacity className="bg-red-500 p-4 rounded-2xl flex-row items-center justify-center" style={{ shadowColor: '#EF4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 }}>
            <Ionicons name="remove-circle-outline" size={24} color="white" />
            <Text className="text-white text-lg font-semibold ml-2">Add Expense</Text>
          </TouchableOpacity>
        </View>

        {/* Expense Summary */}
        <View className="px-6 mb-6">
          <View className="bg-white p-6 rounded-2xl" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 }}>
            <Text className="text-gray-700 font-semibold mb-4">This Month</Text>
            <Text className="text-3xl font-bold text-red-600 mb-2">$0.00</Text>
            <Text className="text-gray-500">Total expenses</Text>
          </View>
        </View>

        {/* Categories */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Categories</Text>
          <View className="flex-row flex-wrap justify-between">
            {['Food', 'Transport', 'Shopping', 'Bills'].map((category) => (
              <View key={category} className="w-1/2 p-1">
                <View className="bg-white p-4 rounded-xl items-center" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}>
                  <Text className="font-semibold text-gray-700">{category}</Text>
                  <Text className="text-gray-500 text-sm">$0.00</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Expenses */}
        <View className="px-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Recent Expenses</Text>
          <View className="bg-white p-6 rounded-2xl" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 }}>
            <Text className="text-gray-500 text-center">No expenses recorded yet</Text>
            <Text className="text-gray-400 text-center text-sm mt-1">Add your first expense to get started</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}