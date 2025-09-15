import { Slot, useRouter, useSegments } from "expo-router"
import React, { useEffect } from "react"
import { ActivityIndicator, View } from "react-native"
import { AuthProvider, useAuth } from "../context/AuthContext"
import { ExpenseProvider } from "../context/ExpensesContext"
import { IncomeProvider } from "../context/IncomeContext"
import { LoaderProvider } from "../context/LoaderContext"
import "./../global.css"

const InitialLayout = () => {
  const { user, loading } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    // Wait until auth state is loaded
    if (loading) return

    const inAuthGroup = segments[0] === "(auth)" || segments[0] === "login" || segments[0] === "register"
    const inTabsGroup = segments[0] === "(tabs)"

    // If user is logged in, redirect to dashboard (tabs index)
    if (user && !inTabsGroup) {
      router.replace("/")  // Redirect to root index (dashboard)
    } 
    // If user is not logged in, redirect to login
    else if (!user && inTabsGroup) {
      router.replace("/(auth)/login")
    }
  }, [user, loading, segments, router])

  // Show loading spinner while checking auth
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
        <IncomeProvider>
          <ExpenseProvider>
            <InitialLayout />
          </ExpenseProvider>
        </IncomeProvider>
      </AuthProvider>
    </LoaderProvider>
  )
}

export default RootLayout
