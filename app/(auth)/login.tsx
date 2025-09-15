import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { login } from "../../services/authService";

const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [isLoadingLogin, setIsLoadingLogin] = useState<boolean>(false)

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return false;
    }
    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }
    if (!password) {
      Alert.alert("Error", "Please enter your password");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (isLoadingLogin) return;
    
    if (!validateForm()) return;
    
    setIsLoadingLogin(true);
    
    try {
      await login(email.trim(), password);
      // Navigation will be handled by the auth context in _layout.tsx
    } catch (err: any) {
      console.error(err);
      let errorMessage = "Something went wrong. Please try again.";
      
      if (err.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address.";
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email address format.";
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      }
      
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setIsLoadingLogin(false);
    }
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F8FAFC']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
       {/* Header Section */}
       <View className="flex-1 justify-center px-6">
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginHorizontal: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 6 }}>
          {/* Logo/Icon Section */}
          <View style={{ alignItems: 'center', marginBottom: 14 }}>
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Ionicons name="wallet" size={36} color="#2563EB" />
            </View>
            <Text style={{ fontSize: 24, fontWeight: '700', color: '#2563EB', marginBottom: 6 }}>Welcome Back</Text>
            <Text style={{ color: '#64748B', textAlign: 'center' }}>Sign in to your Revenue Tracker account</Text>
          </View>
           {/* Input Fields */}
           <View className="mb-6">
             <View className="mb-4">
              <Text style={{ color: '#2563EB', fontSize: 13, fontWeight: '600', marginBottom: 8 }}>Email Address</Text>
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#6B8BD6"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  fontSize: 16,
                  paddingVertical: 12,
                  paddingHorizontal: 14,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#2563EB',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A'
                }}
              />
             </View>
             
             <View className="mb-4">
              <Text style={{ color: '#2563EB', fontSize: 13, fontWeight: '600', marginBottom: 8 }}>Password</Text>
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#6B8BD6"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={{
                  fontSize: 16,
                  paddingVertical: 12,
                  paddingHorizontal: 14,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#2563EB',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A'
                }}
              />
             </View>
           </View>
 
           {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoadingLogin}
            style={{ borderRadius: 12, marginBottom: 16, shadowColor: '#2563EB', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 6 }}
          >
            <LinearGradient
              colors={['#2563EB', '#3B82F6']}
              style={{
                paddingVertical: 14,
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {isLoadingLogin ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Sign In</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
 
           {/* Divider */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#E6EEF9' }} />
            <Text style={{ marginHorizontal: 12, color: '#94A3B8', fontSize: 13 }}>or</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: '#E6EEF9' }} />
          </View>
 
           {/* Register Link */}
          <Pressable onPress={() => router.push("/(auth)/register")}>
            <Text style={{ textAlign: 'center', fontSize: 14 }}>
              <Text style={{ color: '#94A3B8' }}>Don't have an account? </Text>
              <Text style={{ color: '#2563EB', fontWeight: '700' }}>Create Account</Text>
            </Text>
          </Pressable>
         </View>
       </View>
 
       {/* Footer */}
      <View style={{ paddingBottom: 24, paddingHorizontal: 16 }}>
        <Text style={{ textAlign: 'center', color: '#94A3B8', fontSize: 12 }}>
          © 2024 Revenue Tracker. All rights reserved.
        </Text>
      </View>
     </LinearGradient>
   )
 }
 
 export default Login
