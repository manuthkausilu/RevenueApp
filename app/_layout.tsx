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

    const inAuthGroup = segments[0] === "(auth)"

    // If user is logged in and tries to access auth screens, redirect to home
    if (user && inAuthGroup) {
      router.replace("/(app)/home")
    } 
    // If user is not logged in and is not in the auth group, redirect to login
    else if (!user && !inAuthGroup) {
      router.replace("/(auth)/login")
    }
  }, [user, loading, segments, router])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
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
