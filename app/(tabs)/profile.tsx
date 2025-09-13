import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../services/authService';

const ProfileScreen = () => {
  const { user } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
      ]
    );
  };

  return (
    <LinearGradient colors={['#1f2937', '#111827', '#000000']} style={{ flex: 1 }}>
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold text-white mb-4">Profile</Text>
        <View className="bg-gray-800 p-6 rounded-xl mb-4">
          <Text className="text-white text-lg mb-2">User Information</Text>
          <Text className="text-gray-300 mb-1">Email: {user?.email}</Text>
          <Text className="text-gray-300">User ID: {user?.uid}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} className="bg-red-600 p-4 rounded-xl">
          <Text className="text-white text-center font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default ProfileScreen;
