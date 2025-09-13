import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const { user } = useAuth();

  return (
    <LinearGradient
      colors={['#1f2937', '#111827', '#000000']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View className="flex-1">
        <View style={{ paddingTop: 48, paddingBottom: 24, paddingHorizontal: width * 0.05 }}>
          <Text className="text-2xl font-bold text-white mb-2">Welcome back!</Text>
          <Text className="text-gray-300">Hello {user?.email}</Text>
          <Text className="text-lg font-semibold text-white mt-4 mb-2">Revenue Tracker Dashboard</Text>
          <Text className="text-gray-300">Manage your income and expenses efficiently</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default HomeScreen;

