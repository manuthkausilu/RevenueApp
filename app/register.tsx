import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebase';
import { saveUserProfile } from '../services/userService';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !name || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Save additional user data to Firestore
      await saveUserProfile({
        email: userCredential.user.email!,
        name: name,
        createdAt: new Date().toISOString()
      });
      
      Alert.alert('Success', 'Account created successfully!');
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0F172A', '#1E293B', '#334155']} style={{ flex: 1 }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={{ 
            flexGrow: 1, 
            justifyContent: 'center', 
            paddingHorizontal: 20,
            paddingVertical: 40 
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <View 
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                padding: 20,
                borderRadius: 20,
                marginBottom: 20,
              }}
            >
              <Ionicons name="person-add" size={60} color="#10B981" />
            </View>
            <Text style={{
              fontSize: 32,
              fontWeight: '800',
              color: 'white',
              marginBottom: 8,
              textAlign: 'center',
            }}>
              Create Account 🚀
            </Text>
            <Text style={{
              fontSize: 16,
              color: 'rgba(148, 163, 184, 0.8)',
              textAlign: 'center',
              lineHeight: 24,
            }}>
              Join thousands managing their finances smartly
            </Text>
          </View>

          {/* Register Form */}
          <View 
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 24,
              padding: 24,
              borderWidth: 1,
              borderColor: 'rgba(16, 185, 129, 0.3)',
              shadowColor: '#10B981',
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 15,
            }}
          >
            {/* Name Field */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: 'white',
                marginBottom: 12,
              }}>
                Full Name
              </Text>
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 16,
                borderWidth: 1,
                borderColor: 'rgba(16, 185, 129, 0.3)',
                paddingHorizontal: 20,
                paddingVertical: 18,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Ionicons name="person-outline" size={20} color="#34D399" style={{ marginRight: 12 }} />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: 'white',
                    padding: 0,
                  }}
                />
              </View>
            </View>

            {/* Email Field */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: 'white',
                marginBottom: 12,
              }}>
                Email Address
              </Text>
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 16,
                borderWidth: 1,
                borderColor: 'rgba(16, 185, 129, 0.3)',
                paddingHorizontal: 20,
                paddingVertical: 18,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Ionicons name="mail-outline" size={20} color="#34D399" style={{ marginRight: 12 }} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: 'white',
                    padding: 0,
                  }}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: 'white',
                marginBottom: 12,
              }}>
                Password
              </Text>
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 16,
                borderWidth: 1,
                borderColor: 'rgba(16, 185, 129, 0.3)',
                paddingHorizontal: 20,
                paddingVertical: 18,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Ionicons name="lock-closed-outline" size={20} color="#34D399" style={{ marginRight: 12 }} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a password"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  secureTextEntry={!showPassword}
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: 'white',
                    padding: 0,
                  }}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="#34D399" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Field */}
            <View style={{ marginBottom: 32 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: 'white',
                marginBottom: 12,
              }}>
                Confirm Password
              </Text>
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 16,
                borderWidth: 1,
                borderColor: 'rgba(16, 185, 129, 0.3)',
                paddingHorizontal: 20,
                paddingVertical: 18,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#34D399" style={{ marginRight: 12 }} />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  secureTextEntry={!showConfirmPassword}
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: 'white',
                    padding: 0,
                  }}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons 
                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="#34D399" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity 
              onPress={handleRegister}
              disabled={loading}
              style={[
                {
                  backgroundColor: '#10B981',
                  borderRadius: 16,
                  paddingVertical: 18,
                  alignItems: 'center',
                  marginBottom: 20,
                  shadowColor: '#10B981',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 8,
                },
                loading && { opacity: 0.7 }
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {loading && (
                  <Ionicons name="hourglass-outline" size={20} color="white" style={{ marginRight: 8 }} />
                )}
                <Text style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: 'white',
                }}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Login Link */}
            <TouchableOpacity 
              onPress={() => router.push('/login')}
              style={{
                backgroundColor: '#3B82F6',
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: 'center',
                borderWidth: 2,
                borderColor: '#1E40AF',
                shadowColor: '#3B82F6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <Text style={{
                fontSize: 16,
                color: 'white',
                textAlign: 'center',
                fontWeight: '600',
              }}>
                Already have an account? Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default RegisterScreen;
