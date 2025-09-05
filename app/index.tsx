import { Redirect } from "expo-router"
import React from "react"

const Index = () => {
  // Redirect to login by default - auth logic in _layout will handle the rest
  return <Redirect href="/(auth)/login" />
}

export default Index
