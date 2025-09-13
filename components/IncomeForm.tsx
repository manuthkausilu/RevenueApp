import React, { useEffect, useState } from 'react';
import { Alert, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Income } from '../services/incomeService';

interface IncomeFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (income: Omit<Income, 'id'>) => void;
  editingIncome: Income | null;
}

const IncomeForm: React.FC<IncomeFormProps> = ({ visible, onClose, onSave, editingIncome }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (editingIncome) {
      setAmount(editingIncome.amount.toString());
      setDescription(editingIncome.description);
      setDate(editingIncome.date);
    } else {
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [editingIncome, visible]);

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
          <Text className="text-white text-xl mb-4">{editingIncome ? 'Edit Income' : 'Add Income'}</Text>
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
            <TouchableOpacity onPress={handleSave} className="bg-blue-600 p-3 rounded">
              <Text className="text-white">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default IncomeForm;
