import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Expense } from '../services/expenseService';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onEdit, onDelete }) => {
  const handleDeletePress = (id: string) => {
    Alert.alert('Confirm', 'Delete this expense?', [
      { text: 'Cancel' },
      { text: 'Delete', onPress: () => onDelete(id) }
    ]);
  };

  const renderItem = ({ item }: { item: Expense }) => (
    <View className="bg-gray-800 p-4 m-2 rounded-xl">
      <Text className="text-white text-lg">${item.amount}</Text>
      <Text className="text-gray-300">{item.description}</Text>
      <Text className="text-gray-400">
        {typeof item.date === 'string' ? item.date : new Date(item.date).toLocaleDateString()}
      </Text>
      <View className="flex-row mt-2">
        <TouchableOpacity onPress={() => onEdit(item)} className="mr-4">
          <Ionicons name="pencil" size={20} color="#f3f4f6" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeletePress(item.id!)}>
          <Ionicons name="trash" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={expenses}
      keyExtractor={(item) => item.id!}
      renderItem={renderItem}
      ListEmptyComponent={<Text className="text-gray-300 text-center">No expenses yet</Text>}
    />
  );
};

export default ExpenseList;
