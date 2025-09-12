import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function IncomeScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="pt-12 pb-6">
        {/* Header */}
        <View className="px-6 mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">Income</Text>
          <Text className="text-gray-600">Track your earnings and revenue</Text>
        </View>

        {/* Add Income Button */}
        <View className="px-6 mb-6">
          <TouchableOpacity className="bg-blue-500 p-4 rounded-2xl flex-row items-center justify-center" style={{ shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 }}>
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text className="text-white text-lg font-semibold ml-2">Add Income</Text>
          </TouchableOpacity>
        </View>

        {/* Income Summary */}
        <View className="px-6 mb-6">
          <View className="bg-white p-6 rounded-2xl" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 }}>
            <Text className="text-gray-700 font-semibold mb-4">This Month</Text>
            <Text className="text-3xl font-bold text-blue-600 mb-2">$0.00</Text>
            <Text className="text-gray-500">Total income</Text>
          </View>
        </View>

        {/* Recent Income */}
        <View className="px-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Recent Income</Text>
          <View className="bg-white p-6 rounded-2xl" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 }}>
            <Text className="text-gray-500 text-center">No income recorded yet</Text>
            <Text className="text-gray-400 text-center text-sm mt-1">Add your first income to get started</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}