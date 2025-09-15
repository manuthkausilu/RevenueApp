import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebase';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
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
          <View style={{ alignItems: 'center', marginBottom: 50 }}>
            <View 
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                padding: 20,
                borderRadius: 20,
                marginBottom: 20,
              }}
            >
              <Ionicons name="wallet" size={60} color="#3B82F6" />
            </View>
            <Text style={{
              fontSize: 32,
              fontWeight: '800',
              color: 'white',
              marginBottom: 8,
              textAlign: 'center',
            }}>
              Welcome Back! 👋
            </Text>
            <Text style={{
              fontSize: 16,
              color: 'rgba(148, 163, 184, 0.8)',
              textAlign: 'center',
              lineHeight: 24,
            }}>
              Sign in to your account to continue managing your finances
            </Text>
          </View>

          {/* Login Form */}
          <View 
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 24,
              padding: 24,
              borderWidth: 1,
              borderColor: 'rgba(59, 130, 246, 0.3)',
              shadowColor: '#3B82F6',
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 15,
            }}
          >
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
                borderColor: 'rgba(59, 130, 246, 0.3)',
                paddingHorizontal: 20,
                paddingVertical: 18,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Ionicons name="mail-outline" size={20} color="#60A5FA" style={{ marginRight: 12 }} />
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
            <View style={{ marginBottom: 32 }}>
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
                borderColor: 'rgba(59, 130, 246, 0.3)',
                paddingHorizontal: 20,
                paddingVertical: 18,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Ionicons name="lock-closed-outline" size={20} color="#60A5FA" style={{ marginRight: 12 }} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
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
                    color="#60A5FA" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity 
              onPress={handleLogin}
              disabled={loading}
              style={[
                {
                  backgroundColor: '#3B82F6',
                  borderRadius: 16,
                  paddingVertical: 18,
                  alignItems: 'center',
                  marginBottom: 20,
                  shadowColor: '#3B82F6',
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
                  {loading ? 'Signing In...' : 'Sign In'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Register Link */}
            <TouchableOpacity 
              onPress={() => router.push('/register')}
              style={{
                backgroundColor: '#10B981',
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: 'center',
                borderWidth: 2,
                borderColor: '#059669',
                shadowColor: '#10B981',
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
                Don't have an account? Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default LoginScreen;
