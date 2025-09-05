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
import { login } from "../../services/authService"

const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState<string>("")
  const [password, setPasword] = useState<string>("")
  const [isLodingReg, setIsLoadingReg] = useState<boolean>(false)

  const handleLogin = async () => {
    // if(!email){

    // }
    //
    if (isLodingReg) return
    setIsLoadingReg(true)
    await login(email, password)
      .then((res) => {
        console.log(res)
        router.replace("/(app)/home")
      })
      .catch((err) => {
        console.error(err)
        Alert.alert("Login failed", "Somthing went wrong")
        // import { Alert } from "react-native"
      })
      .finally(() => {
        setIsLoadingReg(false)
      })
  }

  return (
    <LinearGradient
      colors={['#dbeafe', '#e0e7ff', '#c7d2fe']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Header Section */}
      <View className="flex-1 justify-center px-6">
        <View className="bg-white rounded-3xl p-8 mx-2" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 }}>
          {/* Logo/Icon Section */}
          <View className="items-center mb-8">
            <LinearGradient
              colors={['#3b82f6', '#8b5cf6']}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16
              }}
            >
              <Text className="text-white text-3xl font-bold">💰</Text>
            </LinearGradient>
            <Text className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</Text>
            <Text className="text-gray-500 text-center">Sign in to your Revenue Tracker account</Text>
          </View>

          {/* Input Fields */}
          <View className="mb-6">
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-medium mb-2">Email Address</Text>
              <TextInput
                placeholder="Enter your email"
                className="bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-4 text-gray-800 text-base"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ fontSize: 16 }}
              />
            </View>
            
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-medium mb-2">Password</Text>
              <TextInput
                placeholder="Enter your password"
                className="bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-4 text-gray-800 text-base"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={password}
                onChangeText={setPasword}
                style={{ fontSize: 16 }}
              />
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLodingReg}
            style={{ borderRadius: 12, marginBottom: 16, shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 }}
          >
            <LinearGradient
              colors={['#3b82f6', '#8b5cf6']}
              style={{
                paddingVertical: 16,
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {isLodingReg ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text className="text-center text-lg font-semibold text-white">Sign In</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center mb-4">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="mx-4 text-gray-500 text-sm">or</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          {/* Register Link */}
          <Pressable onPress={() => router.push("/(auth)/register")}>
            <Text className="text-center text-base">
              <Text className="text-gray-600">Don't have an account? </Text>
              <Text className="text-blue-600 font-semibold">Create Account</Text>
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Footer */}
      <View className="pb-8 px-6">
        <Text className="text-center text-gray-400 text-sm">
          © 2024 Revenue Tracker. All rights reserved.
        </Text>
      </View>
    </LinearGradient>
  )
}

export default Login
