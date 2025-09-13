import React, { useEffect, useState } from 'react';
import { Alert, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Expense } from '../services/expenseService';

interface ExpenseFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (expense: Omit<Expense, 'id'>) => void;
  editingExpense: Expense | null;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ visible, onClose, onSave, editingExpense }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount.toString());
      setDescription(editingExpense.description);
      setDate(editingExpense.date);
    } else {
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [editingExpense, visible]);

  const handleSave = () => {
    if (!amount || !description || !date) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    onSave({ amount: parseFloat(amount), description, date });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-center bg-black bg-opacity-50">
        <View className="bg-gray-800 p-6 m-4 rounded-xl">
          <Text className="text-white text-xl mb-4">{editingExpense ? 'Edit Expense' : 'Add Expense'}</Text>
          <TextInput
            placeholder="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            className="bg-gray-700 p-3 rounded mb-4 text-white"
            placeholderTextColor="#9CA3AF"
          />
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            className="bg-gray-700 p-3 rounded mb-4 text-white"
            placeholderTextColor="#9CA3AF"
          />
          <TextInput
            placeholder="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
            className="bg-gray-700 p-3 rounded mb-4 text-white"
            placeholderTextColor="#9CA3AF"
          />
          <View className="flex-row justify-between">
            <TouchableOpacity onPress={onClose} className="bg-gray-600 p-3 rounded">
              <Text className="text-white">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} className="bg-red-600 p-3 rounded">
              <Text className="text-white">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ExpenseForm;