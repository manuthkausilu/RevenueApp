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
    <LinearGradient colors={['#FFFFFF', '#F8FAFC', '#E2E8F0']} style={{ flex: 1 }}>
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
        {/* Single Profile Card */}
        <View 
          className="bg-white p-8 rounded-3xl border border-blue-200 w-full max-w-sm mb-8"
          style={{
            borderRadius: 24,
            shadowColor: '#3B82F6',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
            elevation: 15,
          }}
        >
          <View className="items-center">
            {/* Profile Icon */}
            <View className="bg-blue-100 p-6 rounded-full mb-6">
              <Ionicons name="person" size={60} color="#3B82F6" />
            </View>

            {/* User Name */}
            <Text className="text-black text-3xl font-bold text-center mb-3">
              {userProfile?.name || user?.displayName || user?.email?.split('@')[0] || 'User'}
            </Text>

            {/* User Email */}
            <Text className="text-blue-600 text-base text-center mb-6">
              {user?.email || 'No email available'}
            </Text>

            {/* Member Since */}
            <View className="bg-blue-50 px-6 py-3 rounded-xl mb-8">
              <Text className="text-gray-700 text-sm font-medium">
                Member since {(() => {
                  // Try userProfile.createdAt first
                  if (userProfile?.createdAt) {
                    try {
                      const date = typeof userProfile.createdAt === 'string' 
                        ? new Date(userProfile.createdAt)
                        : userProfile.createdAt.toDate ? userProfile.createdAt.toDate() : new Date(userProfile.createdAt);
                      return date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      });
                    } catch (error) {
                      console.log('Error parsing userProfile.createdAt:', error);
                    }
                  }
                  
                  // Try user.metadata.creationTime
                  if (user?.metadata?.creationTime) {
                    try {
                      const date = new Date(user.metadata.creationTime);
                      return date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      });
                    } catch (error) {
                      console.log('Error parsing user.metadata.creationTime:', error);
                    }
                  }
                  
                  // Fallback to today's date
                  return new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  });
                })()}
              </Text>
            </View>

            {/* Logout Button */}
            <TouchableOpacity 
              onPress={handleLogout}
              disabled={loading}
              style={{
                backgroundColor: '#DC2626',
                borderRadius: 16,
                paddingHorizontal: 32,
                paddingVertical: 16,
                width: '100%',
                shadowColor: '#DC2626',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 8,
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
                <Text style={{
                  color: 'white',
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                  {loading ? 'Logging out...' : 'Logout'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default ProfileScreen;
