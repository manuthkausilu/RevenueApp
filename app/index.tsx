import { Redirect } from "expo-router"
import React from "react"

const Index = () => {
  // Redirect to tabs by default - auth logic in _layout will handle the rest
  return <Redirect href="/(tabs)" />
}

export default Index
