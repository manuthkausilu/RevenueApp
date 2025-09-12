import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ReportsScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="pt-12 pb-6">
        {/* Header */}
        <View className="px-6 mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">Reports</Text>
          <Text className="text-gray-600">View detailed financial reports and analytics</Text>
        </View>

        {/* Report Cards */}
        <View className="px-6">
          {[
            { title: 'Monthly Summary', icon: 'calendar-outline', color: 'blue', bgColor: '#dbeafe', iconColor: '#3b82f6' },
            { title: 'Income Analysis', icon: 'trending-up-outline', color: 'green', bgColor: '#dcfce7', iconColor: '#10b981' },
            { title: 'Expense Breakdown', icon: 'pie-chart-outline', color: 'red', bgColor: '#fee2e2', iconColor: '#ef4444' },
            { title: 'Category Trends', icon: 'bar-chart-outline', color: 'purple', bgColor: '#f3e8ff', iconColor: '#8b5cf6' }
          ].map((report) => (
            <TouchableOpacity
              key={report.title}
              className="bg-white p-6 rounded-2xl mb-4 flex-row items-center"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3
              }}
            >
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: report.bgColor }}
              >
                <Ionicons name={report.icon as any} size={24} color={report.iconColor} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">{report.title}</Text>
                <Text className="text-gray-500">View detailed analysis</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}