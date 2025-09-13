import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, useRouter } from 'expo-router';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#1f2937', '#111827', '#000000']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View className="flex-1">
        <View style={{ paddingTop: 48, paddingBottom: 24, paddingHorizontal: width * 0.05 }}>
          <Text className="text-2xl font-bold text-white mb-2">Dashboard</Text>
          <Text className="text-gray-300">Welcome to your revenue tracker!</Text>
          {/* Add summary cards, charts, or other content here */}
        </View>
      </View>
      
      {/* Footer Navigation with Icons */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#374151', padding: width * 0.025, borderTopWidth: 1, borderTopColor: '#4b5563' }}>
        <TouchableOpacity onPress={() => router.push('/')} className="items-center" style={{ flex: 1 }}>
          <Ionicons name="home" size={24} color="#f3f4f6" />
          <Text className="text-gray-300 text-xs font-semibold mt-1">Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/income')} className="items-center" style={{ flex: 1 }}>
          <Ionicons name="cash" size={24} color="#f3f4f6" />
          <Text className="text-gray-300 text-xs font-semibold mt-1">Income</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/expenses')} className="items-center" style={{ flex: 1 }}>
          <Ionicons name="card" size={24} color="#f3f4f6" />
          <Text className="text-red-400 text-xs font-semibold mt-1">Expenses</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/reports')} className="items-center" style={{ flex: 1 }}>
          <Ionicons name="bar-chart" size={24} color="#f3f4f6" />
          <Text className="text-gray-300 text-xs font-semibold mt-1">Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/profile')} className="items-center" style={{ flex: 1 }}>
          <Ionicons name="person" size={24} color="#f3f4f6" />
          <Text className="text-gray-300 text-xs font-semibold mt-1">Profile</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default function Index() {
  return <Redirect href="/(tabs)" />;
}

export { DashboardScreen };
