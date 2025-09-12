import { Slot, useRouter, useSegments } from "expo-router"
import React, { useEffect } from "react"
import { ActivityIndicator, View } from "react-native"
import { AuthProvider, useAuth } from "../context/AuthContext"
import { LoaderProvider } from "../context/LoaderContext"
import "./../global.css"

const InitialLayout = () => {
  const { user, loading } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    // Wait until auth state is loaded
    if (loading) return

    const inTabsGroup = segments[0] === "(tabs)"

    // If user is logged in and tries to access auth screens, redirect to tabs
    if (user && !inTabsGroup) {
      router.replace("/(tabs)")
    } 
    // If user is not logged in and is not in the auth group, redirect to login
    else if (!user && inTabsGroup) {
      router.replace("/(auth)/login")
    }
  }, [user, loading, segments, router])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    )
  }

  return <Slot />
}

const RootLayout = () => {
  return (
    <LoaderProvider>
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
    </LoaderProvider>
  )
}

export default RootLayout
