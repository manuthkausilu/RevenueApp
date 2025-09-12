// import React from "react";
// import { View, Text, TouchableOpacity, Image, ScrollView, Alert, StyleSheet } from "react-native";
// import { useAuth } from "../../context/AuthContext";
// import { useRouter } from "expo-router";
// import { logout } from "../../services/authService";
// import { Ionicons } from "@expo/vector-icons";

// export default function ProfileScreen() {
//   const { user } = useAuth();
//   const router = useRouter();

//   const handleLogout = async () => {
//     Alert.alert(
//       "Logout",
//       "Are you sure you want to logout?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Logout",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               await logout();
//               router.replace("/(auth)/login");
//             } catch (err: any) {
//               alert(err.message);
//             }
//           }
//         }
//       ]
//     );
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.content}>
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Profile</Text>
//         </View>

//         {/* User Info Card */}
//         <View style={styles.userCardContainer}>
//           <View style={styles.userCard}>
//             {user?.photoURL ? (
//               <Image
//                 source={{ uri: user.photoURL }}
//                 style={styles.avatar}
//               />
//             ) : (
//               <View style={styles.avatarPlaceholder}>
//                 <Ionicons name="person-outline" size={40} color="#3B82F6" />
//               </View>
//             )}
//             <Text style={styles.userName}>
//               {user?.displayName || "User"}
//             </Text>
//             <Text style={styles.userEmail}>{user?.email}</Text>
//           </View>
//         </View>

//         {/* Menu Items */}
//         <View style={styles.menuContainer}>
//           {{
//             { title: 'Edit Profile', icon: 'person-outline', action: () => {} },
//             { title: 'Settings', icon: 'settings-outline', action: () => {} },
//             { title: 'Export Data', icon: 'download-outline', action: () => {} },
//             { title: 'Help & Support', icon: 'help-circle-outline', action: () => {} },
//             { title: 'Privacy Policy', icon: 'shield-outline', action: () => {} },
//           }.map((item) => (
//             <TouchableOpacity
//               key={item.title}
//               onPress={item.action}
//               style={styles.menuItem}
//             >
//               <Ionicons name={item.icon as any} size={24} color="#6B7280" />
//               <Text style={styles.menuItemText}>{item.title}</Text>
//               <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
//             </TouchableOpacity>
//           ))}

//           {/* Logout Button */}
//           <TouchableOpacity
//             onPress={handleLogout}
//             style={styles.logoutButton}
//           >
//             <Ionicons name="log-out-outline" size={24} color="white" />
//             <Text style={styles.logoutButtonText}>Logout</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f9fafb',
//   },
//   content: {
//     paddingTop: 48,
//     paddingBottom: 24,
//   },
//   header: {
//     paddingHorizontal: 24,
//     marginBottom: 24,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1f2937',
//   },
//   userCardContainer: {
//     paddingHorizontal: 24,
//     marginBottom: 24,
//   },
//   userCard: {
//     backgroundColor: '#ffffff',
//     padding: 24,
//     borderRadius: 16,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   avatar: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     marginBottom: 16,
//   },
//   avatarPlaceholder: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#dbeafe',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 16,
//   },
//   userName: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#1f2937',
//     marginBottom: 4,
//   },
//   userEmail: {
//     fontSize: 16,
//     color: '#6b7280',
//   },
//   menuContainer: {
//     paddingHorizontal: 24,
//   },
//   menuItem: {
//     backgroundColor: '#ffffff',
//     padding: 16,
//     borderRadius: 16,
//     marginBottom: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   menuItemText: {
//     marginLeft: 16,
//     fontSize: 18,
//     fontWeight: '500',
//     color: '#1f2937',
//     flex: 1,
//   },
//   logoutButton: {
//     backgroundColor: '#ef4444',
//     padding: 16,
//     borderRadius: 16,
//     marginTop: 24,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#ef4444',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   logoutButtonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: '600',
//     marginLeft: 8,
//   },
// });