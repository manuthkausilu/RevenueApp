import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Income } from '../services/incomeService';

interface IncomeFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (income: Omit<Income, 'id'>) => void;
  editingIncome?: Income | null;
}

const IncomeForm: React.FC<IncomeFormProps> = ({ visible, onClose, onSave, editingIncome }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

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
    if (!amount || !description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    onSave({
      amount: numericAmount,
      description: description.trim(),
      date,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
      }}>
        <View style={{
          width: '100%',
          maxWidth: 420,
          backgroundColor: 'transparent',
        }}>
          <LinearGradient
            colors={['#0F172A', '#1E293B', '#334155']}
            style={{
              borderRadius: 24,
              overflow: 'hidden',
            }}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: '90%' }}
            >
              {/* Header */}
              <View style={{
                paddingHorizontal: 24,
                paddingTop: 32,
                paddingBottom: 24,
              }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}>
                  <View style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    padding: 12,
                    borderRadius: 16,
                  }}>
                    <Ionicons name="wallet" size={28} color="#10B981" />
                  </View>
                  
                  <TouchableOpacity
                    onPress={onClose}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      padding: 10,
                      borderRadius: 12,
                    }}
                  >
                    <Ionicons name="close" size={24} color="rgba(255, 255, 255, 0.7)" />
                  </TouchableOpacity>
                </View>

                <Text style={{
                  fontSize: 28,
                  fontWeight: '800',
                  color: 'white',
                  marginBottom: 8,
                  textAlign: 'center',
                }}>
                  {editingIncome ? 'Edit Income' : 'Add Income'}
                </Text>
                
                <Text style={{
                  fontSize: 16,
                  color: 'rgba(16, 185, 129, 0.8)',
                  fontWeight: '500',
                  textAlign: 'center',
                  marginBottom: 32,
                }}>
                  Record your revenue source
                </Text>
              </View>

              {/* Form Fields */}
              <View style={{ paddingHorizontal: 24 }}>
                {/* Amount Field */}
                <View style={{ marginBottom: 24 }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: 12,
                  }}>
                    Amount (LKR)
                  </Text>
                  <View style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    paddingHorizontal: 20,
                    paddingVertical: 18,
                  }}>
                    <TextInput
                      value={amount}
                      onChangeText={setAmount}
                      placeholder="Enter amount"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      keyboardType="numeric"
                      style={{
                        fontSize: 18,
                        fontWeight: '600',
                        color: 'white',
                        padding: 0,
                      }}
                    />
                  </View>
                </View>

                {/* Description Field */}
                <View style={{ marginBottom: 24 }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: 12,
                  }}>
                    Description
                  </Text>
                  <View style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    paddingHorizontal: 20,
                    paddingVertical: 18,
                    minHeight: 80,
                  }}>
                    <TextInput
                      value={description}
                      onChangeText={setDescription}
                      placeholder="Enter description"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      multiline
                      numberOfLines={3}
                      style={{
                        fontSize: 16,
                        color: 'white',
                        textAlignVertical: 'top',
                        padding: 0,
                        flex: 1,
                      }}
                    />
                  </View>
                </View>

                {/* Date Field */}
                <View style={{ marginBottom: 32 }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: 12,
                  }}>
                    Date
                  </Text>
                  <View style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    paddingHorizontal: 20,
                    paddingVertical: 18,
                  }}>
                    <TextInput
                      value={date}
                      onChangeText={setDate}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      style={{
                        fontSize: 16,
                        color: 'white',
                        padding: 0,
                      }}
                    />
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={{
                paddingHorizontal: 24,
                paddingBottom: 32,
                gap: 16,
              }}>
                <TouchableOpacity
                  onPress={handleSave}
                  style={{
                    backgroundColor: '#10B981',
                    paddingVertical: 18,
                    borderRadius: 16,
                    alignItems: 'center',
                    shadowColor: '#10B981',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 16,
                    elevation: 8,
                  }}
                >
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: 'white',
                  }}>
                    {editingIncome ? 'Update Income' : 'Add Income'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onClose}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    paddingVertical: 18,
                    borderRadius: 16,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

export default IncomeForm;
