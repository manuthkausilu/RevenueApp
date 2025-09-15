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
import { register } from "../../services/authService";

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
      colors={['#FFFFFF', '#F8FAFC']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
       {/* Header Section */}
       <View className="flex-1 justify-center px-6">
        <View className="rounded-3xl p-8 mx-2" style={{ backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 6 }}>
           {/* Logo/Icon Section */}
          <View className="items-center mb-8">
            <View style={{ width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16, backgroundColor: '#DBEAFE' }}>
              <Ionicons name="analytics" size={36} color="#2563EB" />
            </View>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#2563EB', marginBottom: 8 }}>Create Account</Text>
            <Text style={{ color: '#64748B', textAlign: 'center' }}>Join Revenue Tracker and manage your finances</Text>
          </View>
 
           {/* Input Fields */}
           <View className="mb-6">
            <View className="mb-4">
              <Text style={{ color: '#2563EB', fontSize: 13, fontWeight: '600', marginBottom: 8 }}>Full Name</Text>
              <TextInput
                placeholder="Enter your full name"
                placeholderTextColor="#6B8BD6"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
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
                placeholder="Create a strong password"
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
              <Text style={{ fontSize: 12, color: '#94A3B8', marginTop: 8 }}>
                Password should be at least 6 characters long
              </Text>
            </View>
           </View>
 
           {/* Register Button */}
           <TouchableOpacity
             onPress={handleRegister}
             disabled={isLoadingReg}
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
               {isLoadingReg ? (
                 <ActivityIndicator color="#fff" size="small" />
               ) : (
                 <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Create Account</Text>
               )}
             </LinearGradient>
           </TouchableOpacity>
 
           {/* Terms */}
           <Text style={{ textAlign: 'center', fontSize: 12, color: '#94A3B8', marginBottom: 12 }}>
             By creating an account, you agree to our Terms of Service and Privacy Policy
           </Text>
 
           {/* Divider */}
           <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#E6EEF9' }} />
            <Text style={{ marginHorizontal: 12, color: '#94A3B8', fontSize: 13 }}>or</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: '#E6EEF9' }} />
           </View>
 
           {/* Login Link */}
           <Pressable onPress={() => router.back()}>
             <Text style={{ textAlign: 'center', fontSize: 14 }}>
               <Text style={{ color: '#94A3B8' }}>Already have an account? </Text>
               <Text style={{ color: '#2563EB', fontWeight: '700' }}>Sign In</Text>
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
 
 export default Register
