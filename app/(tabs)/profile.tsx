import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen = () => {
  const { user, userProfile, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await logout();
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <LinearGradient colors={['#0F172A', '#1E293B', '#334155']} style={{ flex: 1 }}>
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingTop: 100, 
          paddingBottom: 120,
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}
      >
        {/* Blue Profile Card */}
        <View 
          className="bg-gradient-to-r from-blue-600/20 to-blue-800/30 p-8 rounded-3xl border border-blue-500/30 w-full max-w-sm mb-8"
          style={{
            borderRadius: 24,
            shadowColor: '#3B82F6',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.4,
            shadowRadius: 20,
            elevation: 15,
          }}
        >
          <View className="items-center">
            {/* Profile Icon */}
            <View className="bg-blue-500/20 p-6 rounded-full mb-6">
              <Ionicons name="person" size={60} color="#3B82F6" />
            </View>

            {/* User Name */}
            <Text className="text-white text-3xl font-bold text-center mb-3">
              {userProfile?.name || user?.displayName || user?.email?.split('@')[0] || 'User'}
            </Text>

            {/* User Email */}
            <Text className="text-blue-300 text-base text-center mb-6">
              {user?.email || 'No email available'}
            </Text>

            {/* Member Since */}
            <View className="bg-blue-500/20 px-6 py-3 rounded-xl">
              <Text className="text-blue-200 text-sm font-medium">
                Member since {user?.metadata?.creationTime ?
                  new Date(user.metadata.creationTime).toLocaleDateString() :
                  'Unknown'
                }
              </Text>
            </View>
          </View>
        </View>

        {/* Red Logout Button */}
        <TouchableOpacity 
          onPress={handleLogout}
          disabled={loading}
          className="bg-red-600 rounded-2xl px-8 py-4 w-full max-w-sm"
          style={{
            shadowColor: '#DC2626',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 12,
            opacity: loading ? 0.6 : 1,
          }}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons 
              name={loading ? "hourglass-outline" : "log-out-outline"} 
              size={24} 
              color="white" 
              style={{ marginRight: 12 }}
            />
            <Text className="text-white text-lg font-bold">
              {loading ? 'Logging out...' : 'Logout'}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default ProfileScreen;
