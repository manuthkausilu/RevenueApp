import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import IncomeForm from '../../components/IncomeForm';
import IncomeList from '../../components/IncomeList';
import { useIncome } from '../../context/IncomeContext';
import { addIncome, deleteIncome, getIncomes, Income, updateIncome } from '../../services/incomeService';

const IncomeScreen = () => {
  const { state, dispatch } = useIncome();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  useEffect(() => {
    loadIncomes();
  }, []);

  const loadIncomes = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await getIncomes();
      dispatch({ type: 'SET_INCOMES', payload: data });
    } catch (error) {
      console.error('Error loading incomes:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load incomes' });
    }
  };

  const handleSave = async (incomeData: Omit<Income, 'id'>) => {
    try {
      if (editingIncome) {
        await updateIncome(editingIncome.id!, incomeData);
        dispatch({ type: 'UPDATE_INCOME', payload: { ...incomeData, id: editingIncome.id! } });
      } else {
        const id = await addIncome(incomeData);
        dispatch({ type: 'ADD_INCOME', payload: { ...incomeData, id } });
      }
      closeModal();
    } catch (error) {
      console.error('Error saving income:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save income' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteIncome(id);
      dispatch({ type: 'DELETE_INCOME', payload: id });
    } catch (error) {
      console.error('Error deleting income:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete income' });
    }
  };

  const openModal = (income?: Income) => {
    setEditingIncome(income || null);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingIncome(null);
  };

  return (
    <LinearGradient colors={['#1f2937', '#111827', '#000000']} style={{ flex: 1 }}>
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold text-white mb-4">Income</Text>
        {state.loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <IncomeList incomes={state.incomes} onEdit={openModal} onDelete={handleDelete} />
        )}
        <TouchableOpacity onPress={() => openModal()} className="absolute bottom-20 right-4 bg-blue-600 p-4 rounded-full">
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <IncomeForm
        visible={modalVisible}
        onClose={closeModal}
        onSave={handleSave}
        editingIncome={editingIncome}
      />
    </LinearGradient>
  );
};

export default IncomeScreen;