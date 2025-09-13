import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from "expo-router"
import React, { useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native"
import { register } from "../../services/authService"

const Register = () => {
  const router = useRouter()
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [isLoadingReg, setIsLoadingReg] = useState<boolean>(false)

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return false;
    }
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return false;
    }
    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (isLoadingReg) return;
    
    if (!validateForm()) return;
    
    setIsLoadingReg(true);
    
    try {
      await register(email.trim(), password, name.trim());
      Alert.alert(
        "Success", 
        "Account created successfully! Please sign in.",
        [{ text: "OK", onPress: () => router.replace("/(auth)/login") }]
      );
    } catch (err: any) {
      console.error(err);
      let errorMessage = "Something went wrong. Please try again.";
      
      if (err.code === "auth/email-already-in-use") {
        errorMessage = "Email address is already in use. Please use a different email.";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please choose a stronger password.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email address format.";
      }
      
      Alert.alert("Registration Failed", errorMessage);
    } finally {
      setIsLoadingReg(false);
    }
  };

  return (
    <LinearGradient
      colors={['#1f2937', '#111827', '#000000']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Header Section */}
      <View className="flex-1 justify-center px-6">
        <View className="bg-gray-800 rounded-3xl p-8 mx-2" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 }}>
          {/* Logo/Icon Section */}
          <View className="items-center mb-8">
            <LinearGradient
              colors={['#374151', '#1f2937']}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16
              }}
            >
              <Text className="text-white text-3xl font-bold">📊</Text>
            </LinearGradient>
            <Text className="text-2xl font-bold text-white mb-2">Create Account</Text>
            <Text className="text-gray-300 text-center">Join Revenue Tracker and manage your finances</Text>
          </View>

          {/* Input Fields */}
          <View className="mb-6">
            <View className="mb-4">
              <Text className="text-gray-300 text-sm font-medium mb-2">Full Name</Text>
              <TextInput
                placeholder="Enter your full name"
                className="bg-gray-700 border-2 border-gray-600 rounded-xl px-4 py-4 text-white text-base"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                style={{ fontSize: 16 }}
              />
            </View>
            <View className="mb-4">
              <Text className="text-gray-300 text-sm font-medium mb-2">Email Address</Text>
              <TextInput
                placeholder="Enter your email"
                className="bg-gray-700 border-2 border-gray-600 rounded-xl px-4 py-4 text-white text-base"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ fontSize: 16 }}
              />
            </View>
            
            <View className="mb-4">
              <Text className="text-gray-300 text-sm font-medium mb-2">Password</Text>
              <TextInput
                placeholder="Create a strong password"
                className="bg-gray-700 border-2 border-gray-600 rounded-xl px-4 py-4 text-white text-base"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={{ fontSize: 16 }}
              />
              <Text className="text-xs text-gray-400 mt-1">
                Password should be at least 6 characters long
              </Text>
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={isLoadingReg}
            style={{ borderRadius: 12, marginBottom: 16, shadowColor: '#374151', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 }}
          >
            <LinearGradient
              colors={['#374151', '#1f2937']}
              style={{
                paddingVertical: 16,
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {isLoadingReg ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text className="text-center text-lg font-semibold text-white">Create Account</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Terms */}
          <Text className="text-center text-xs text-gray-400 mb-4">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </Text>

          {/* Divider */}
          <View className="flex-row items-center mb-4">
            <View className="flex-1 h-px bg-gray-600" />
            <Text className="mx-4 text-gray-400 text-sm">or</Text>
            <View className="flex-1 h-px bg-gray-600" />
          </View>

          {/* Login Link */}
          <Pressable onPress={() => router.back()}>
            <Text className="text-center text-base">
              <Text className="text-gray-400">Already have an account? </Text>
              <Text className="text-blue-400 font-semibold">Sign In</Text>
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Footer */}
      <View className="pb-8 px-6">
        <Text className="text-center text-gray-500 text-sm">
          © 2024 Revenue Tracker. All rights reserved.
        </Text>
      </View>
    </LinearGradient>
  )
}

export default Register
