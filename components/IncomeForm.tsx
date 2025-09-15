import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export interface IncomeFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: { amount: number; description: string; date: string }) => Promise<void> | void;
  editingIncome?: { id?: string; amount: number; description: string; date: string } | null;
  primaryColor?: string;
}

const IncomeForm: React.FC<IncomeFormProps> = ({
  visible,
  onClose,
  onSave,
  editingIncome = null,
  primaryColor = '#2563EB',
}) => {
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    if (editingIncome) {
      setAmount(String(editingIncome.amount));
      setDescription(editingIncome.description || '');
      setDate(editingIncome.date || '');
    } else {
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [editingIncome, visible]);

  const handleSubmit = async () => {
    const amt = parseFloat(amount || '0') || 0;
    await onSave({ amount: amt, description: description.trim(), date: date || new Date().toISOString().split('T')[0] });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.4)', justifyContent: 'flex-end' }}>
          <View style={{
            backgroundColor: '#fff',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 16,
            minHeight: 320,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                backgroundColor: `${primaryColor}20`,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}>
                <Ionicons name="wallet" size={22} color={primaryColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: primaryColor }}>
                  {editingIncome ? 'Edit Income' : 'Add Income'}
                </Text>
                <Text style={{ fontSize: 12, color: '#667085' }}>Quickly add your income</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={{ marginLeft: 8 }}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={{ color: primaryColor, fontWeight: '600', marginBottom: 6 }}>Amount</Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor={`${primaryColor}60`}
                keyboardType="numeric"
                style={{
                  borderWidth: 1,
                  borderColor: primaryColor,
                  backgroundColor: `${primaryColor}08`,
                  borderRadius: 8,
                  padding: 10,
                  color: primaryColor,
                  marginBottom: 12,
                }}
              />

              <Text style={{ color: primaryColor, fontWeight: '600', marginBottom: 6 }}>Description</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="e.g., Freelance payment"
                placeholderTextColor={`${primaryColor}60`}
                style={{
                  borderWidth: 1,
                  borderColor: primaryColor,
                  backgroundColor: `${primaryColor}08`,
                  borderRadius: 8,
                  padding: 10,
                  color: primaryColor,
                  marginBottom: 12,
                }}
              />

              <Text style={{ color: primaryColor, fontWeight: '600', marginBottom: 6 }}>Date</Text>
              <TextInput
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={`${primaryColor}60`}
                style={{
                  borderWidth: 1,
                  borderColor: primaryColor,
                  backgroundColor: `${primaryColor}08`,
                  borderRadius: 8,
                  padding: 10,
                  color: primaryColor,
                  marginBottom: 18,
                }}
              />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                  onPress={onClose}
                  style={{
                    flex: 1,
                    marginRight: 8,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: primaryColor,
                    paddingVertical: 12,
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                  }}
                >
                  <Text style={{ color: primaryColor, fontWeight: '600' }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSubmit}
                  style={{
                    flex: 1,
                    marginLeft: 8,
                    borderRadius: 10,
                    paddingVertical: 12,
                    alignItems: 'center',
                    backgroundColor: primaryColor,
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '700' }}>{editingIncome ? 'Update' : 'Add'}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default IncomeForm;
