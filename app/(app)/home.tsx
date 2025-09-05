import { useRouter } from "expo-router"
import { Text, TouchableOpacity, View } from "react-native"
import { useAuth } from "../../context/AuthContext"
import { logout } from "../../services/authService"

export default function HomeScreen() {
  const { user } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.replace("/(auth)/login")
  }

  return (
    <View className="flex-1 bg-white justify-center items-center p-6">
      <Text className="text-2xl font-bold mb-4">📊 Revenue Tracker</Text>
      <Text className="text-lg mb-4">Welcome, {user?.email}</Text>
      
      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-500 p-4 rounded-lg"
      >
        <Text className="text-white text-center font-bold">Logout</Text>
      </TouchableOpacity>
    </View>
  )
}
